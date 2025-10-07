const { setupWSConnection } = require('y-websocket/bin/utils')
const WebSocket = require('ws')
const { Doc, encodeStateAsUpdate, applyUpdate } = require("yjs");
const cookie = require('cookie')
const Document = require("../models/document");
const { userAuthorization } = require("../middleware/userAuthorization.js")
const { documentAuthorizationCheck } = require("../middleware/documentAuthorizationCheck.js");

function runMiddleware(middleware, req, socket) {
  return new Promise((resolve, reject) => {
    // socket connection request me response object nhi milta
    const fakeRes = {
      status: (code) => ({
        json: (obj) => {
          reject(new Error(obj.message || "Unauthorized"));
          socket.close(); // agar error, to socket close
        },
      }),
    };

    // Middleware call karte hain
    middleware(req, fakeRes, (err) => {
      // next ko handle karna hai

      if (err) {
        // Agar middleware next(err) call kare to:
        reject(err);
        socket.close();
      } else {
        // Agar middleware ne simply next() call kiya to:
        resolve();
      }
    });
  });
}


async function loadDocFromMongo(docName) {
  const ydoc = new Doc();
  const record = await Document.findById(docName);

  if (record && record.content) {
    const update = new Uint8Array(record.content.buffer, record.content.byteOffset, record.content.length);
    applyUpdate(ydoc, update); // apply stored state to new Y.Doc
  }
  return ydoc;
}


async function saveDocToMongo(docName, ydoc) {
  const update = encodeStateAsUpdate(ydoc); // binary Uint8Array
  await Document.findByIdAndUpdate(docName,{content:Buffer.from(update), lastEdited:Date.now()});
  return
}

function connectWebSocket(server){
    const wss = new WebSocket.Server({ server })
    const documentConnectionMap = new Map();

    wss.on("connection", async (socket, req) => {
        
      try{
        //websocket request me req.cookies nhi hota hai
        req.cookies = cookie.parse(req.headers.cookie || "");
        await runMiddleware(userAuthorization,req,socket)
        
        const docName = req.url.slice(1);

        //websocket request me req.params nhi hota hai
        req.params = {docId:docName}
        await runMiddleware(documentAuthorizationCheck,req,socket)

        const docConnections = documentConnectionMap.get(docName) || new Set();
        docConnections.add(socket);
        documentConnectionMap.set(docName, docConnections);

        // Load from Mongo
        const ydoc = await loadDocFromMongo(docName);

        // Setup Y.js sync
        setupWSConnection(socket, req, {
            docName,
            getYDoc: () => ydoc,
        });

        // When last user disconnects → save state
        socket.on("close", async () => {
            const conns = documentConnectionMap.get(docName);
            if (conns) {
                conns.delete(socket);
                if (conns.size === 0) {
                    console.log(`All users left ${docName}, saving...`);
                    await saveDocToMongo(docName, ydoc);
                }
            }
        });
      }catch (error){
        console.error("WebSocket connection error:", error.message);
        socket.close()
      }
    });
}

module.exports=connectWebSocket;