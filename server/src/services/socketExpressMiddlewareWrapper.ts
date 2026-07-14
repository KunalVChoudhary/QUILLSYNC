import type { Request, RequestHandler, Response } from "express";
import type { IncomingMessage, RequestListener } from "http";
import type { Socket } from "socket.io";

export function socketExpressMiddlewareWrapper(
    middleware: RequestHandler,
    req: IncomingMessage,
): Promise<void> {
    return new Promise((resolve, reject) => {

        const fakeRes = {
            status: (_: number) => ({
                json: (body: { message?: string }) => {
                    reject(new Error(body.message ?? "Unauthorized"));
                },
            }),
        } as Partial<Response>;

        middleware(
            req as Request,
            fakeRes as Response,
            (err?: unknown) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            }
        );
    });
}