import { Job, Worker } from 'bullmq';
import redis from '../lib/redis.js'
import { generateSummary } from '../ai/gemmaSummary.js';
import Document from '../models/document.js';
import { emitSummaryCompleted, emitSummaryFailed, emitSummaryFetchingDocument, emitSummaryGeneratingAISummary } from '../websockets/socket.IO/emitters/summaryEmitters.js';

export interface SummaryJobResult {
    docId: string;
    userId: string;
    summary: string;
}

export const aiSummaryWorker = new Worker(
    'ai-summary-doc',
    async (job: Job): Promise<SummaryJobResult | void> => {
        try{
            emitSummaryFetchingDocument(job.data.userId);

            const docId = job.data.docId;
            const document = await Document.findById(docId);
            if (!document) {
                console.error(`Document with ID ${docId} not found.`);
                throw new Error(`Document with ID ${docId} not found.`);
            }

            emitSummaryGeneratingAISummary(job.data.userId);

            const documentContent = String(document.content);
            const summary = await generateSummary(documentContent);

            emitSummaryCompleted(job.data.userId, { docId, userId: job.data.userId, summary });

            return {
                docId: job.data.docId,
                userId: job.data.userId,
                summary
            };
        } catch (error) {
            console.error(`Error processing job ${job.id}:`, error);
            emitSummaryFailed(job.data.userId, error instanceof Error ? error.message : 'Unknown error');
        }
    },
    {
        connection:redis, 
    }
)