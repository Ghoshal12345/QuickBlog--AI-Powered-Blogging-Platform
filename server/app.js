import 'dotenv/config'; //write this line at the top of the file to load environment variables from .env file
import express from 'express';
import cors from 'cors';
// import connectDB from './configs/db_connection.js';
import adminRouter from './routes/admin.js';
import BlogRouter from './routes/blog.js';
import userRouter from './routes/user.js';
import cookieParser from 'cookie-parser';
import { generalLimiter } from './middlewares/rate_limiter.js';
import mongoose from "mongoose";
import { redis } from "./configs/redis.js";
import { redisProducerConnection } from "./configs/redisProducer.js";

import { aiQueue } from "./queues/ai_queue.js";
import { emailQueue } from "./queues/email_queue.js";

const app = express();

// middlewares 
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', generalLimiter); // apply general rate limiter to all routes under /api

// routes
// Liveness: the Express process is running.
app.get("/health/live", (req, res) => {
    res.status(200).json({
        status: "alive"
    });
});

// Readiness: essential dependencies (MongoDB and Redis) are available
app.get('/health/ready', async (req, res) => {
    const mongoReady = mongoose.connection.readyState === 1; // 1 means connected
    const redisReady = redis.status === "ready";
    const redisProducerReady = redisProducerConnection.status === "ready";
    
    try {
        if (!mongoReady || !redisReady || !redisProducerReady) {
            throw new Error("Essential dependencies are not ready");
        }
        
        await redis.ping();
        await redisProducerConnection.ping();
        return res.status(200).json({
            status: "ready"
        });
    } catch (error) {
        console.error("Error occurred while checking readiness:", error);
        return res.status(503).json({
            status: "not ready",
            dependencies: {
                database: mongoReady ? "up" : "down",
                cacheRedis: redis.status,
                queueRedis: redisProducerConnection.status
            }
        });
    }
})

app.get('/', (req, res) => {
    res.send("hello world");
});
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);
app.use('/api/blog', BlogRouter);

// cache
// server and DB connection

let server;
let isShuttingDown = false;

// Function to assign the HTTP server instance
export const setServer = (serverInstance) => {
    server = serverInstance;
};

async function closeRedisClient(client) {
    if (client.status === "end") return; //* client is already closed
    if (client.status === "ready") {
        await client.quit();
    } else {
        client.disconnect();
    }
}

async function shutdown(signal) {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(`${signal} received. Shutting down API...`);

    try {
        // Stop accepting new HTTP connections.
        if (server?.listening) {
            await new Promise((resolve) => {
                server.close(resolve);
            });
        }

        // Close the queue objects before their Redis clients.
        await Promise.allSettled([
            aiQueue.close(),
            emailQueue.close()
        ]);

        // Close every Redis client created by this API process.
        await Promise.allSettled([
            closeRedisClient(redis),
            closeRedisClient(redisProducerConnection),
        ]);

        // Close the MongoDB connection.
        await mongoose.disconnect();

        console.log("API shutdown completed");

    } catch (error) {
        console.error("API shutdown error:", error.message);
        process.exitCode = 1;
    }
}
process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));


export default app;

// we are not checking the redis worker connection here because the worker is a separate process and its readiness is not critical for the API to function. The API can still accept requests and enqueue jobs even if the worker is not ready, as long as Redis is available for job queuing.

// when ctrl + C is press in server terminal , then enqueues should be closed first before redisProducerConnection 
// when ctrl + C is press in worker terminal , then workers should be closed first before redisWorkerConnection 