import { getIO } from "../socketioServer.js";
import type { SummaryJobResult } from "../../../workers/aiSummaryWorker.js";

export const emitSummaryQueued = (userId: string): void => {
    getIO()
        .to(userId)
        .emit("summary:queued", {
            message: "Your request is queued.",
        });
};

export const emitSummaryFetchingDocument = (
    userId: string
): void => {
    getIO()
        .to(userId)
        .emit("summary:fetching", {
            message: "Fetching document...",
        });
};

export const emitSummaryGeneratingAISummary = (
    userId: string
): void => {
    getIO()
        .to(userId)
        .emit("summary:generating", {
            message: "Generating AI summary...",
        });
};

export const emitSummaryCompleted = (
    userId: string,
    data: SummaryJobResult
): void => {
    getIO()
        .to(userId)
        .emit("summary:completed", data);
};

export const emitSummaryFailed = (
    userId: string,
    error: string
): void => {
    getIO()
        .to(userId)
        .emit("summary:failed", {
            message: error,
        });
};

export const emitSummaryDuplicateRequest = (
    userId: string
): void => {
    getIO()
        .to(userId)
        .emit("summary:duplicateRequest", {
            message:
                "Duplicate request. Please wait for the previous summary to complete.",
        });
};