import { Queue } from 'bullmq';

let queueInstance: Queue | null = null;

/**
 * Get or create the AI queue instance.
 * Only creates a queue if Redis is configured.
 * Returns null in serverless environments without Redis.
 */
export function getAiQueue(): Queue | null {
  // Skip queue creation in serverless without Redis
  if (!process.env.REDIS_HOST) {
    return null;
  }

  // Lazy initialization
  if (!queueInstance) {
    queueInstance = new Queue('ai-analysis', {
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: 100,
        removeOnFail: 100,
      },
    });
  }
  
  return queueInstance;
}

