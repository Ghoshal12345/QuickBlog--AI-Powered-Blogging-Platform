import { Queue } from "bullmq";
import { redisProducerConnection  } from "../configs/redisProducer.js";

export const emailQueue = new Queue("emailQueue", {
    connection: redisProducerConnection ,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 2000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    },
});