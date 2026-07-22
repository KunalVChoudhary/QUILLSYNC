import * as http from "http";
import { WebSocket, WebSocketServer } from "ws";
import { type Request } from "express";
import { socketExpressMiddlewareWrapper } from "../../services/socketExpressMiddlewareWrapper.js";
import cookieParser from "cookie-parser";
import { userAuthorization } from "../../middleware/userAuthorization.js";
import { generateSummarySchema } from "../../zodSchema/summarySchema.js";
import { authorizeDocumentAccess } from "../../services/documentAuthorizationService.js";
import { setupWSConnection , setPersistence, getYDoc} from "@y/websocket-server/utils";
import { saveDocToMongo, loadDocFromMongo } from "./mongoPersistence.js";
import * as Y from 'yjs'
import { publisher, subscriber } from "../../lib/redis.js";


function initializeWebSocketServer(server: http.Server) {
    const wss = new WebSocketServer({ server });

    server.on('upgrade', async(request, socket, head) => {
        try{
            await socketExpressMiddlewareWrapper(
                cookieParser(),
                request,
            );

            await socketExpressMiddlewareWrapper(
                userAuthorization,
                request,
            );

            let docId = (request.url || '').slice(1);
            const result = generateSummarySchema.safeParse({ docId });
            if (!result.success) {
                throw new Error("Invalid docId");

            }

            (request as Request).document = await authorizeDocumentAccess(
                (request as Request).user!.userId,
                result.data.docId
            );

            wss.handleUpgrade(request, socket, head, (ws) => {
                wss.emit('connection', ws, request);
            });


        }catch(error){
            socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
            socket.destroy();
            return
        }
    });

    wss.on('connection', async (ws: WebSocket, req: http.IncomingMessage) => {

        setupWSConnection(ws, req, {docName: (req as Request).document!.id, gc: true });

        ws.on('close', () => {
            try{
                console.log('Connection closed');
            } catch (error) {
                if (error instanceof Error) {
                    console.error(error.message);
                }
                ws.close();
            }

        })

    });

    setPersistence({
        bindState: async (docName, ydoc) => {

            const persistedData = await loadDocFromMongo(docName);
            const update = Y.encodeStateAsUpdate(persistedData);
            Y.applyUpdate(ydoc, update);

            try {
                await subscriber.subscribe(`doc-updates-${docName}`);
                console.log(`Subscribed to doc-updates-${docName}`);
            } catch (err) {
                console.error("Redis subscription failed:", err);
                throw err;
            }

            ydoc.on('update', async( update, origin) => {

                if (origin === 'redis') {
                    return
                }
                try {
                    await publisher.publish(`doc-updates-${docName}`, Buffer.from(update))
                } catch (err) {
                    console.error(err);
                }
            })

        },
        writeState: async (docName, ydoc) => {
            try{
                await saveDocToMongo(docName, ydoc);
                await subscriber.unsubscribe(`doc-updates-${docName}`)
            } catch (err){
                console.error(err);
            }

        },
        provider: null
    })

    subscriber.on('messageBuffer', (channel, message) => {
        try {
            const docName = channel.toString().replace("doc-updates-", "");
            const ydoc = getYDoc(docName);

            Y.applyUpdate(ydoc, message, "redis");
        } catch (err) {
            console.error(err);
        }


    });
}