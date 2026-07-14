import { Server } from "socket.io";
import http from "http";
import { socketExpressMiddlewareWrapper } from "../../services/socketExpressMiddlewareWrapper.js";
import { userAuthorization } from "../../middleware/userAuthorization.js";
import cookieParser from "cookie-parser";
import type { Request } from "express";
import { registerIncomingSummaryEventEmitters } from "./handlers/summaryHandlers.js";

export let io: Server;

export const connectSocketIO = (server: http.Server) => {
    try {   
        io = new Server(server, {
            path: "/socket.io",
            cors: {
                origin: process.env.CLIENT_URL,
                credentials: true
            }
        })
        
        io.use(async (socket, next) => {
            try {
                await socketExpressMiddlewareWrapper(
                    cookieParser(),
                    socket.request,
                );

                await socketExpressMiddlewareWrapper(
                    userAuthorization,
                    socket.request,
                );

                socket.data.user = (socket.request as Request).user;

                next();
            } catch (err) {
                next(err as Error);
            }
        });

        io.on("connection", async(socket) => {

            socket.join(socket.data.user.userId);

            registerIncomingSummaryEventEmitters(socket);

            socket.on("disconnect", (reason) => {
                console.log('A user disconnected', reason)
            })

        });

    } catch(error){
        console.error(error)
    }
}


export const getIO = () => io
