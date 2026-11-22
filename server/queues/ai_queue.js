import { Queue } from "bullmq";
import { redisProducerConnection  } from "../configs/redisProducer.js";

export const aiQueue = new Queue("aiQueue", {
    connection: redisProducerConnection ,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 3000,//3 sec
        },

        // Keep completed results available for frontend polling.
        removeOnComplete: {
            age: 3600,
            count: 500
        },
        // Keep failed jobs temporarily for debugging.
        removeOnFail: {
            age: 86400,
            count: 500,
        },
    },
});