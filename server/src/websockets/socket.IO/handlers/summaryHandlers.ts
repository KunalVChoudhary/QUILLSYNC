import type { Socket } from "socket.io";
import { enqueueSummaryJob } from "../../../queue/aiSummaryQueue.js";
import { authorizeDocumentAccess } from "../../../services/documentAuthorizationService.js";
import { generateSummarySchema } from "../../../zodSchema/summarySchema.js";
import {
    emitSummaryFailed,
    emitSummaryQueued,
} from "../emitters/summaryEmitters.js";

interface GenerateSummaryPayload {
    docId: string;
}

export const generateSummaryHandler = (socket: Socket) => {
    socket.on(
        "summary:generate",
        async ({ docId }: GenerateSummaryPayload) => {
            try {
                const result = generateSummarySchema.safeParse({ docId });

                if (!result.success) {
                    emitSummaryFailed(
                        socket.data.user.userId,
                        "Invalid payload"
                    );
                    return;
                }

                await authorizeDocumentAccess(
                    socket.data.user.userId,
                    result.data.docId
                );

                await enqueueSummaryJob({
                    docId: result.data.docId,
                    userId: socket.data.user.userId,
                });

                emitSummaryQueued(socket.data.user.userId);

            } catch (error) {
                emitSummaryFailed(
                    socket.data.user.userId,
                    error instanceof Error
                        ? error.message
                        : "Unknown error"
                );
            }
        }
    );
};

export const registerIncomingSummaryEventEmitters = (
    socket: Socket
) => {
    generateSummaryHandler(socket);
};