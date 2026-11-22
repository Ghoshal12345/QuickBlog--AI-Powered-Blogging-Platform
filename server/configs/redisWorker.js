
import Redis from "ioredis";

const redisUrl =
    process.env.REDIS_URL || "redis://localhost:6379";

const retryStrategy = (times) =>
    Math.min(times * 500, 5000);


// Used by BullMQ workers.
// BullMQ workers require maxRetriesPerRequest: null.
const redisWorkerConnection = new Redis(redisUrl, {
    maxRetriesPerRequest: null,//*If Redis is disconnected, this removes the per-request retry limit. The worker can wait for Redis to reconnect. It doesn't disable reconnection..
    retryStrategy,
});//! separate Redis client objects(connections) to the same Redis server. Closing one does not automatically close the other.

redisWorkerConnection.on("ready", () => {
    console.log("✅ Worker Redis connected");
});

redisWorkerConnection.on("error", (error) => {
    console.error("❌ Worker Redis Error:", error.message);
});

redisWorkerConnection.on("reconnecting", () => {
    console.warn("⚠️ Worker Redis reconnecting...");
});

redisWorkerConnection.on("end", () => {
    console.warn("Redis connection ended: Worker Redis");
});

export { redisWorkerConnection };