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
  try {
    const record = await Document.findById(docId).lean().exec();
    const ydoc = new Y.Doc();

    if (record && record.content) {
      let buf = (record.content instanceof Buffer) 
        ? record.content 
        : (record.content.buffer !== undefined) 
          ? Buffer.from(record.content.buffer)
          : Buffer.from(record.content);
          
      if (buf.length > 0) {
        const update = new Uint8Array(buf);
        Y.applyUpdate(ydoc, update);
      }
    }
    return ydoc;    
  } catch (error) {
    console.error(`[LOAD] Error loading document ${docId}:`, error.message);
    return new Y.Doc();
  }
}

async function saveDocToMongo(docId, ydoc) {
  try {
    const update = encodeStateAsUpdate(ydoc);
    const buffer = Buffer.from(update);
    
    await Document.findByIdAndUpdate(
      docId,
      { content: buffer, lastEdited: new Date() },
      { upsert: true }
    );
    
    console.log(`[SAVE] Saved document ${docId} (${update.length} bytes)`);
    
  } catch (error) {
    console.error(`[SAVE] Error saving document ${docId}:`, error.message);
  }
}

function attachListenersToActualDoc(docId, intendedLocalYDoc, mapDocs, autosaveIntervalMs = 5000) {
  const internalDocs = wsUtils['docs'];
  
  if (!internalDocs) {
    if (intendedLocalYDoc) {
      intendedLocalYDoc.on('update', () => {});
    }
    return { ydoc: intendedLocalYDoc, interval: null };
  }

  let serverDoc = internalDocs.get(docId);
  
  if (intendedLocalYDoc && serverDoc) {
    const existingState = encodeStateAsUpdate(serverDoc);
    const loadedState = encodeStateAsUpdate(intendedLocalYDoc);
    
    if (loadedState.length > existingState.length) {
      try {
        Y.applyUpdate(serverDoc, loadedState);
        console.log(`[ATTACH] Merged ${loadedState.length} bytes into server doc ${docId}`);
      } catch (error) {
        console.error(`[ATTACH] Error merging state for ${docId}:`, error.message);
      }
    }
  }

  if (!serverDoc) {
    return { ydoc: intendedLocalYDoc, interval: null };
  }

  const interval = setInterval(() => {
    saveDocToMongo(docId, serverDoc);
  }, autosaveIntervalMs);

  mapDocs.set(docId, { ydoc: serverDoc, interval });

  return { ydoc: serverDoc, interval };
}

function connectWebSocket(server) {
  const wss = new WebSocket.Server({ server });
  console.log('[WS] WebSocket server started');

  const userCountDocMap = new Map();
  const mapDocs = new Map();

  wss.on('connection', async (socket, req) => {
    const connectionId = Math.random().toString(36).substr(2, 9);
    let docId;
    
    try {
      req.cookies = cookie.parse(req.headers.cookie || '');
      await runMiddleware(userAuthorization, req, socket);

      docId = (req.url || '').slice(1);
      if (!docId) {
        socket.close();
        return;
      }
      
      req.params = { docId };
      await runMiddleware(documentAuthorizationCheck, req, socket);

      const userCount = userCountDocMap.get(docId) || 0;
      userCountDocMap.set(docId, userCount + 1);

      // Load document from database
      const intendedLocalYDoc = await loadDocFromMongo(docId);

      if (userCount === 0) {
        // First user - setup normally
        console.log(`[WS] First user connecting to ${docId}`);
        
        setupWSConnection(socket, req, {
          docName: docId,
          getYDoc: () => intendedLocalYDoc
        });
        
        attachListenersToActualDoc(docId, intendedLocalYDoc, mapDocs);
        
      } else {
        // Additional user - ensure server doc is ready first
        console.log(`[WS] Additional user (#${userCount + 1}) connecting to ${docId}`);
        
        const internalDocs = wsUtils['docs'];
        let serverDoc = internalDocs?.get(docId);
        
        if (serverDoc) {
          const serverState = encodeStateAsUpdate(serverDoc);
          const loadedState = encodeStateAsUpdate(intendedLocalYDoc);
          
          console.log(`[WS] Server: ${serverState.length} bytes, Loaded: ${loadedState.length} bytes`);
          
          // Merge loaded state into server doc if newer
          if (loadedState.length > serverState.length) {
            try {
              Y.applyUpdate(serverDoc, loadedState);
              console.log(`[WS] Updated server doc with fresh DB state (${loadedState.length} bytes)`);
            } catch (error) {
              console.error(`[WS] Error merging fresh state:`, error.message);
            }
          }
          
          // Use the ready server doc
          setupWSConnection(socket, req, {
            docName: docId,
            getYDoc: () => serverDoc  // ✅ Use server doc with merged state
          });
          
        } else {
          console.warn(`[WS] No server doc found for ${docId}, using fallback`);
          // Fallback
          setupWSConnection(socket, req, {
            docName: docId,
            getYDoc: () => intendedLocalYDoc
          });
        }
      }

      console.log(`[WS] Client connected to document ${docId} (${userCount + 1} users)`);

      // Keep WebSocket alive (Render.com fix)
      const pingInterval = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.ping();
        }
      }, 30000);

      socket.on('close', async () => {
        clearInterval(pingInterval);
        
        const currentUserCount = userCountDocMap.get(docId);
        if (!currentUserCount) return;
        
        const newUserCount = currentUserCount - 1;
        userCountDocMap.set(docId, newUserCount);
        
        console.log(`[WS] Client disconnected from ${docId} (${newUserCount} users remaining)`);
        
        if (newUserCount === 0) {
          const docData = mapDocs.get(docId);
          if (docData) {
            await saveDocToMongo(docId, docData.ydoc);
            if (docData.interval) {
              clearInterval(docData.interval);
            }
            mapDocs.delete(docId);
            console.log(`[WS] Document ${docId} removed from memory`);
          }
          userCountDocMap.delete(docId);
        }
      });

      socket.on('error', (err) => {
        clearInterval(pingInterval);
        console.error(`[WS] Socket error for ${docId}:`, err.message);
      });

    } catch (error) {
      console.error('[WS] Connection setup error:', error.message);
      try { socket.close(); } catch(_) {}
    }
  });

  wss.on('error', (error) => {
    console.error('[WS] Server error:', error.message);
  });
}

module.exports = connectWebSocket;
