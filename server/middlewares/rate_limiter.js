import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import {redis} from '../configs/redis.js';

// Wait for Redis to become ready before running store initialization commands.
const waitForRedisReady = () => {
    if (redis.status === 'ready') {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        const cleanup = () => {
            redis.off('ready', onReady);
            redis.off('end', onEnd);
        };

        const onReady = () => {
            cleanup();
            resolve();
        };

        const onEnd = () => {
            cleanup();
            reject(new Error('Redis connection ended before becoming ready.'));
        };

        redis.once('ready', onReady);
        redis.once('end', onEnd);

        // Guard against Redis becoming ready while listeners are registered.
        if (redis.status === 'ready') {
            onReady();
        }
    });
};


const createLimiter = ({ windowMs, limit, message, prefix, passOnStoreError = false }) => {
    const redisStore = new RedisStore({
        prefix,
        sendCommand: async (command, ...args) => {
            await waitForRedisReady();
            return redis.call(command, ...args);
        }
    })
    return rateLimit({
        windowMs, //kitne time window mein
        limit, // kitne requests allow karne hai
        standardHeaders: "draft-8",
        legacyHeaders: false,
        store: redisStore,
        passOnStoreError,
        message: { message }
    });
};

// General API Rate Limiter
const generalLimiter = createLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message: "Too many requests. Please try again later.",
    prefix: 'rl:general:',
    passOnStoreError: true // Allow requests to proceed even if Redis is down
})

// Authentication Rate Limiter
const authLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: "Too many authentication attempts. Please try again later.",
    prefix: 'rl:auth:',
    passOnStoreError: false //? Block requests if Redis is down to prevent abuse
})

// OTP Rate Limiter
const otpLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: "Too many OTP requests. Please try again later.",
    prefix: 'rl:otp:',
    passOnStoreError: false
})

// AI generation Rate Limiter
const aiLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: "Too many AI generation requests. Please try again later.",
    prefix: 'rl:ai:',
    passOnStoreError: false
})

export {
    generalLimiter,
    authLimiter,
    otpLimiter,
    aiLimiter
}