import { Queue, QueueEvents } from 'bullmq';
import redis from '../lib/redis.js';
import { emitSummaryDuplicateRequest } from '../websockets/socket.IO/emitters/summaryEmitters.js';


export interface enqueueSummaryJobParams {
    docId:string,
    userId:string
}


export const aiSummaryQueue = new Queue(
  'ai-summary-doc', 
  {
    connection: redis,
    defaultJobOptions:{ 
      delay: 2000,
      removeOnComplete: {
        age: 360,
        count: 100, 
      },
      removeOnFail: {
        age: 24*360,
        count: 500, 
      },
    } 
  }
);

await aiSummaryQueue.setGlobalConcurrency(4);
await aiSummaryQueue.setGlobalRateLimit(4, 1000);

export const enqueueSummaryJob = async (enqueueSummaryJobPayload:enqueueSummaryJobParams)=>{

  await aiSummaryQueue.add(
    'aiSummary', 
    enqueueSummaryJobPayload,
    { 
      attempts: 3,
      backoff: {
          type: "exponential",
          delay: 3000,
      },
      // deduplication give kind of rate limiting effect, as it prevents the same user from spamming the queue with multiple jobs in a short time frame.
      deduplication: { 
        id: `${enqueueSummaryJobPayload.userId}`, 
        ttl: 5*60*1000,
      },
    },
  );
  
}

const queueEvents = new QueueEvents('ai-summary-doc',{connection: redis,});

queueEvents.on(
  	'deduplicated',
  	async ({ jobId, deduplicationId, deduplicatedJobId }, id) => {
		console.log(`Job ${deduplicatedJobId} was deduplicated due to existing job ${jobId} 
			with deduplication ID ${deduplicationId}`);
		const userId = await aiSummaryQueue.getJob(deduplicatedJobId).then(job => job?.data.userId);
		if (userId) {
			emitSummaryDuplicateRequest(userId);
		}
  
  },
);