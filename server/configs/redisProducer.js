
import Redis from "ioredis";

const redisUrl =
    process.env.REDIS_URL || "redis://localhost:6379";

const retryStrategy = (times) =>
    Math.min(times * 500, 5000);


// Used by API processes to enqueue jobs.
// Fail producer commands promptly during outages.
const redisProducerConnection = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    retryStrategy,
});

redisProducerConnection.on("ready", () => {
    console.log("✅ Queue producer Redis connected");
});

redisProducerConnection.on("error", (error) => {
    console.error("❌ Queue producer Redis Error:", error.message);
});

redisProducerConnection.on("reconnecting", () => {
    console.warn("⚠️ Queue producer Redis reconnecting...");
});

redisProducerConnection.on("end", () => {
    console.warn("Redis connection ended: Queue producer Redis");
});

export { redisProducerConnection };
