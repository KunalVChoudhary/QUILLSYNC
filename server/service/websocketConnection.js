const WebSocket = require('ws');
const wsUtils = require('y-websocket/bin/utils');
const { setupWSConnection } = wsUtils;
const Y = require('yjs');
const { encodeStateAsUpdate } = require('yjs');
const Document = require('../models/document');
const cookie = require('cookie');
const { userAuthorization } = require('../middleware/userAuthorization');
const { documentAuthorizationCheck } = require('../middleware/documentAuthorizationCheck');

function runMiddleware(middleware, req, socket) {
  return new Promise((resolve, reject) => {
    const fakeRes = {
      status: (code) => ({
        json: (obj) => {
          reject(new Error(obj.message || 'Unauthorized'));
          try { socket.close(); } catch (e) {}
        },
      }),
    };
    try {
      middleware(req, fakeRes, (err) => {
        if (err) { 
          reject(err); 
          try { socket.close(); } catch (e) {} 
        } else {
          resolve();
        }
      });
    } catch (e) {
      reject(e);
      try { socket.close(); } catch (er) {}
    }
  });
}

async function loadDocFromMongo(docId) {
  const startTime = Date.now();
  console.log(`[LOAD-START] ${docId} | Time: ${new Date().toISOString()}`);
  
  try {
    const dbStartTime = Date.now();
    const record = await Document.findById(docId).lean().exec();
    const dbDuration = Date.now() - dbStartTime;
    console.log(`[LOAD-DB] ${docId} | DB Query: ${dbDuration}ms | Found: ${!!record}`);
    
    const ydoc = new Y.Doc();
    console.log(`[LOAD-YDOC] ${docId} | Created Y.Doc | guid: ${ydoc.guid}`);

    if (record && record.content) {
      console.log(`[LOAD-CONTENT] ${docId} | Content exists | Type: ${typeof record.content} | Constructor: ${record.content.constructor?.name}`);
      console.log(`[LOAD-CONTENT] ${docId} | Is Buffer: ${record.content instanceof Buffer} | Has .buffer: ${record.content.buffer !== undefined}`);
      
      let buf = (record.content instanceof Buffer) 
        ? record.content 
        : (record.content.buffer !== undefined) 
          ? Buffer.from(record.content.buffer)
          : Buffer.from(record.content);
      
      console.log(`[LOAD-BUFFER] ${docId} | Buffer length: ${buf.length} | First 20 bytes: [${Array.from(buf.slice(0, 20)).join(', ')}]`);
          
      if (buf.length > 0) {
        const update = new Uint8Array(buf);
        console.log(`[LOAD-UINT8] ${docId} | Uint8Array length: ${update.length}`);
        
        const beforeState = encodeStateAsUpdate(ydoc);
        console.log(`[LOAD-BEFORE] ${docId} | Y.Doc state before apply: ${beforeState.length} bytes`);
        
        Y.applyUpdate(ydoc, update);
        
        const afterState = encodeStateAsUpdate(ydoc);
        console.log(`[LOAD-AFTER] ${docId} | Y.Doc state after apply: ${afterState.length} bytes`);
        console.log(`[LOAD-SHARED] ${docId} | Shared types: [${Object.keys(ydoc.share).join(', ')}]`);
      } else {
        console.log(`[LOAD-EMPTY] ${docId} | Buffer is empty, skipping applyUpdate`);
      }
    } else {
      console.log(`[LOAD-NORECORD] ${docId} | No record or no content field`);
    }
    
    const totalDuration = Date.now() - startTime;
    console.log(`[LOAD-SUCCESS] ${docId} | Total time: ${totalDuration}ms | Final state: ${encodeStateAsUpdate(ydoc).length} bytes`);
    return ydoc;    
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error(`[LOAD-ERROR] ${docId} | Error: ${error.message} | Time: ${totalDuration}ms`);
    console.error(`[LOAD-ERROR-STACK] ${docId} |`, error.stack);
    return new Y.Doc();
  }
}

async function saveDocToMongo(docId, ydoc) {
  const startTime = Date.now();
  console.log(`[SAVE-START] ${docId} | Time: ${new Date().toISOString()}`);
  
  try {
    const update = encodeStateAsUpdate(ydoc);
    console.log(`[SAVE-ENCODE] ${docId} | Encoded state: ${update.length} bytes`);
    
    const buffer = Buffer.from(update);
    console.log(`[SAVE-BUFFER] ${docId} | Buffer: ${buffer.length} bytes`);
    
    const dbStartTime = Date.now();
    await Document.findByIdAndUpdate(
      docId,
      { content: buffer, lastEdited: new Date() },
    );
    const dbDuration = Date.now() - dbStartTime;
    
    const totalDuration = Date.now() - startTime;
    console.log(`[SAVE-SUCCESS] ${docId} | DB time: ${dbDuration}ms | Total: ${totalDuration}ms`);
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error(`[SAVE-ERROR] ${docId} | Error: ${error.message} | Time: ${totalDuration}ms`);
    console.error(`[SAVE-ERROR-STACK] ${docId} |`, error.stack);
  }
}

function attachListenersToActualDoc(docId, intendedLocalYDoc, mapDocs, autosaveIntervalMs = 5000) {
  const startTime = Date.now();
  console.log(`[ATTACH-START] ${docId} | Time: ${new Date().toISOString()}`);
  
  const internalDocs = wsUtils['docs'];
  
  if (!internalDocs) {
    console.error(`[ATTACH-NODOCS] ${docId} | Internal docs map not found!`);
    if (intendedLocalYDoc) {
      intendedLocalYDoc.on('update', () => {});
    }
    return { ydoc: intendedLocalYDoc, interval: null };
  }

  console.log(`[ATTACH-INTERNAL] ${docId} | Internal docs map size: ${internalDocs.size} | Keys: [${Array.from(internalDocs.keys()).join(', ')}]`);

  let serverDoc = internalDocs.get(docId);
  console.log(`[ATTACH-GET] ${docId} | Server doc found: ${!!serverDoc}`);
  
  if (!serverDoc) {
    console.error(`[ATTACH-MISSING] ${docId} | Server doc not in internal map! This should not happen.`);
    return { ydoc: intendedLocalYDoc, interval: null };
  }

  // Critical: Merge loaded state
  if (intendedLocalYDoc) {
    const existingState = encodeStateAsUpdate(serverDoc);
    const loadedState = encodeStateAsUpdate(intendedLocalYDoc);
    
    console.log(`[ATTACH-COMPARE] ${docId} | Existing state: ${existingState.length} bytes | Loaded state: ${loadedState.length} bytes`);
    console.log(`[ATTACH-COMPARE] ${docId} | Existing first 20: [${Array.from(existingState.slice(0, 20)).join(', ')}]`);
    console.log(`[ATTACH-COMPARE] ${docId} | Loaded first 20: [${Array.from(loadedState.slice(0, 20)).join(', ')}]`);
    
    if (loadedState.length > existingState.length) {
      console.log(`[ATTACH-MERGE-NEEDED] ${docId} | Will merge ${loadedState.length} bytes into server doc`);
      try {
        const beforeMerge = encodeStateAsUpdate(serverDoc);
        console.log(`[ATTACH-MERGE-BEFORE] ${docId} | State before merge: ${beforeMerge.length} bytes`);
        
        Y.applyUpdate(serverDoc, loadedState);
        
        const afterMerge = encodeStateAsUpdate(serverDoc);
        console.log(`[ATTACH-MERGE-AFTER] ${docId} | State after merge: ${afterMerge.length} bytes`);
        console.log(`[ATTACH-MERGE-SUCCESS] ${docId} | Merged successfully | Shared types: [${Object.keys(serverDoc.share).join(', ')}]`);
      } catch (error) {
        console.error(`[ATTACH-MERGE-ERROR] ${docId} | Error: ${error.message}`);
        console.error(`[ATTACH-MERGE-ERROR-STACK] ${docId} |`, error.stack);
      }
    } else {
      console.log(`[ATTACH-NO-MERGE] ${docId} | No merge needed (loaded <= existing)`);
    }
  } else {
    console.warn(`[ATTACH-NO-INTENDED] ${docId} | No intendedLocalYDoc provided`);
  }

  const interval = setInterval(() => {
    console.log(`[AUTOSAVE-TRIGGER] ${docId} | Time: ${new Date().toISOString()}`);
    saveDocToMongo(docId, serverDoc);
  }, autosaveIntervalMs);

  mapDocs.set(docId, { ydoc: serverDoc, interval });
  
  const totalDuration = Date.now() - startTime;
  console.log(`[ATTACH-SUCCESS] ${docId} | Total time: ${totalDuration}ms | Final state: ${encodeStateAsUpdate(serverDoc).length} bytes`);

  return { ydoc: serverDoc, interval };
}

function connectWebSocket(server) {
  const wss = new WebSocket.Server({ server });
  console.log(`[WS-INIT] WebSocket server started | Time: ${new Date().toISOString()}`);
  
  const userCountDocMap = new Map();
  const mapDocs = new Map();

  wss.on('connection', async (socket, req) => {
    const connectionId = Math.random().toString(36).substr(2, 9);
    const connectionStartTime = Date.now();
    console.log(`\n========================================`);
    console.log(`[WS-CONNECT] ID: ${connectionId} | Time: ${new Date().toISOString()}`);
    console.log(`[WS-CONNECT] URL: ${req.url}`);
    
    let docId;
    
    try {
      req.cookies = cookie.parse(req.headers.cookie || '');
      console.log(`[WS-AUTH-START] ${connectionId} | Starting user authorization`);
      await runMiddleware(userAuthorization, req, socket);
      console.log(`[WS-AUTH-SUCCESS] ${connectionId} | User authorized`);

      docId = (req.url || '').slice(1);
      console.log(`[WS-DOCID] ${connectionId} | Document ID: ${docId}`);
      
      if (!docId) {
        console.error(`[WS-NO-DOCID] ${connectionId} | No document ID in URL, closing`);
        socket.close();
        return;
      }
      
      req.params = { docId };
      console.log(`[WS-DOC-AUTH-START] ${connectionId} | Starting document authorization`);
      await runMiddleware(documentAuthorizationCheck, req, socket);
      console.log(`[WS-DOC-AUTH-SUCCESS] ${connectionId} | Document access authorized`);

      const userCount = userCountDocMap.get(docId) || 0;
      userCountDocMap.set(docId, userCount + 1);
      console.log(`[WS-USERCOUNT] ${connectionId} | ${docId} | Previous: ${userCount} | New: ${userCount + 1}`);

      console.log(`[WS-LOAD-START] ${connectionId} | ${docId} | Loading from DB`);
      const loadStartTime = Date.now();
      const intendedLocalYDoc = await loadDocFromMongo(docId);
      const loadDuration = Date.now() - loadStartTime;
      console.log(`[WS-LOAD-END] ${connectionId} | ${docId} | Load time: ${loadDuration}ms | State: ${encodeStateAsUpdate(intendedLocalYDoc).length} bytes`);

      console.log(`[WS-SETUP-START] ${connectionId} | ${docId} | Calling setupWSConnection`);
      const setupStartTime = Date.now();
      setupWSConnection(socket, req, {
        docName: docId
      });
      const setupDuration = Date.now() - setupStartTime;
      console.log(`[WS-SETUP-END] ${connectionId} | ${docId} | Setup time: ${setupDuration}ms`);

      if (userCount === 0) {
        console.log(`[WS-FIRST-USER] ${connectionId} | ${docId} | First user, attaching listeners`);
        const attachStartTime = Date.now();
        attachListenersToActualDoc(docId, intendedLocalYDoc, mapDocs);
        const attachDuration = Date.now() - attachStartTime;
        console.log(`[WS-ATTACH-END] ${connectionId} | ${docId} | Attach time: ${attachDuration}ms`);
      } else {
        console.log(`[WS-ADDITIONAL-USER] ${connectionId} | ${docId} | User #${userCount + 1}, skipping attach`);
      }
      
      const totalConnectionTime = Date.now() - connectionStartTime;
      console.log(`[WS-CONNECT-SUCCESS] ${connectionId} | ${docId} | Total connection time: ${totalConnectionTime}ms`);
      console.log(`========================================\n`);
      
      socket.on('close', async () => {
        console.log(`\n========================================`);
        console.log(`[WS-CLOSE] ${connectionId} | ${docId} | Time: ${new Date().toISOString()}`);
        
        const currentUserCount = userCountDocMap.get(docId);
        if (!currentUserCount) {
          console.warn(`[WS-CLOSE-NO-COUNT] ${connectionId} | ${docId} | No user count found`);
          return;
        }
        
        const newUserCount = currentUserCount - 1;
        userCountDocMap.set(docId, newUserCount);
        console.log(`[WS-CLOSE-COUNT] ${connectionId} | ${docId} | Previous: ${currentUserCount} | New: ${newUserCount}`);
        
        if (newUserCount === 0) {
          console.log(`[WS-CLOSE-LAST] ${connectionId} | ${docId} | Last user, cleaning up`);
          const docData = mapDocs.get(docId);
          if (docData) {
            console.log(`[WS-CLOSE-SAVE] ${connectionId} | ${docId} | Final save starting`);
            await saveDocToMongo(docId, docData.ydoc);
            console.log(`[WS-CLOSE-SAVE-DONE] ${connectionId} | ${docId} | Final save complete`);
            
            if (docData.interval) {
              clearInterval(docData.interval);
              console.log(`[WS-CLOSE-INTERVAL] ${connectionId} | ${docId} | Interval cleared`);
            }
            mapDocs.delete(docId);
            console.log(`[WS-CLOSE-DELETE] ${connectionId} | ${docId} | Removed from memory`);
          } else {
            console.warn(`[WS-CLOSE-NO-DATA] ${connectionId} | ${docId} | No doc data found for cleanup`);
          }
          userCountDocMap.delete(docId);
        } else {
          console.log(`[WS-CLOSE-OTHERS] ${connectionId} | ${docId} | ${newUserCount} users still connected`);
        }
        console.log(`========================================\n`);
      });

      socket.on('error', (err) => {
        console.error(`[WS-SOCKET-ERROR] ${connectionId} | ${docId} | Error: ${err.message}`);
        console.error(`[WS-SOCKET-ERROR-STACK] ${connectionId} | ${docId} |`, err.stack);
      });

    } catch (error) {
      const totalConnectionTime = Date.now() - connectionStartTime;
      console.error(`[WS-CONNECT-ERROR] ${connectionId} | ${docId || 'unknown'} | Error: ${error.message} | Time: ${totalConnectionTime}ms`);
      console.error(`[WS-CONNECT-ERROR-STACK] ${connectionId} |`, error.stack);
      try { socket.close(); } catch(_) {}
    }
  });

  wss.on('error', (error) => {
    console.error(`[WS-SERVER-ERROR] Error: ${error.message} | Time: ${new Date().toISOString()}`);
    console.error(`[WS-SERVER-ERROR-STACK]`, error.stack);
  });
}

module.exports = connectWebSocket;
