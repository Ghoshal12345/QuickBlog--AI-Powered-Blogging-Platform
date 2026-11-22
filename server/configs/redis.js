import Redis from "ioredis";

const redisUrl =
    process.env.REDIS_URL || "redis://localhost:6379";

// Retry connections with a capped delay.
const retryStrategy = (times) => Math.min(times * 500, 5000);//*controls how long to wait before reconnecting.  (1st retry: 500 ms) (2nd retry: 1000 ms) (3rd retry: 1500 ms).....(Max delay: 5000 ms (5 seconds))


// Used by cache and Redis-backed rate limiting.
// Fail cache commands promptly when Redis is unavailable.
const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    retryStrategy,
});

redis.on("ready", () => {
    console.log("✅ Cache and Rate Limiting Redis connected");
});

redis.on("error", (error) => {
    console.error("❌ Cache and Rate Limiting Redis Error:", error.message);
});

redis.on("reconnecting", () => {
    console.warn("⚠️ Cache and Rate Limiting Redis reconnecting...");
});

redis.on("end", () => {
    console.warn("Redis connection ended: Cache and Rate Limiting Redis");
});

export { redis };
