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

  const userCountDocMap = new Map();
  const mapDocs = new Map();

  wss.on('connection', async (socket, req) => {
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

      const intendedLocalYDoc = await loadDocFromMongo(docId);

      setupWSConnection(socket, req, {
        docName: docId,
        getYDoc: () => intendedLocalYDoc
      });

      if (userCount === 0) {
        attachListenersToActualDoc(docId, intendedLocalYDoc, mapDocs);
      }

      socket.on('close', async () => {
        const currentUserCount = userCountDocMap.get(docId);
        if (!currentUserCount) return;
        
        const newUserCount = currentUserCount - 1;
        userCountDocMap.set(docId, newUserCount);
        
        if (newUserCount === 0) {
          const docData = mapDocs.get(docId);
          if (docData) {
            await saveDocToMongo(docId, docData.ydoc);
            if (docData.interval) {
              clearInterval(docData.interval);
            }
            mapDocs.delete(docId);
          }
          userCountDocMap.delete(docId);
        }
      });

      socket.on('error', (err) => {
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