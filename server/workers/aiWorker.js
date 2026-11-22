import "dotenv/config";
import { Worker } from "bullmq";
import crypto from "node:crypto";
import { redis } from "../configs/redis.js";
import { redisWorkerConnection } from "../configs/redisWorker.js";
import generateContent from "../configs/groqAi.js";
import { getCache, setCache } from "../utils/cache.js";

const aiWorker = new Worker(
    "aiQueue",
    async (job) => {
        console.log(`Processing AI job: ${job.id}, type: ${job.name}`);
        if (job.name !== "generateContent") {
            throw new Error(`Unknown AI job type: ${job.name}`);
        }
        const { prompt } = job.data;
        // const { userId } = job.data;

        // Reuse the existing prompt-based Redis cache.
        const cleanPrompt = prompt.trim();

        const promptHash = crypto
            .createHash("sha256")
            .update(cleanPrompt)
            .digest("hex");

        const cacheKey = `ai:content:${promptHash}`;

        const cachedContent = await getCache(cacheKey);
        if (cachedContent) {
            console.log(`AI cache hit for job: ${job.id}`);
            return {
                content: cachedContent,
                message: "Content generated from cache",
                source: "cache"
            };
        }

        const aiPrompt = `
Write a detailed and engaging blog post about:

${cleanPrompt}

Generate the blog content as clean HTML that can be
directly inserted into a Quill editor.

Use only appropriate HTML tags such as:
<h2>, <h3>, <p>, <strong>, <em>, <ul>, <ol>, <li>.

Do not use Markdown.
Do not include code fences.
Return only the HTML content.
`;

        // This potentially slow operation now runs in worker
        const generatedContent = await generateContent(aiPrompt);
        if (!generatedContent || generatedContent.trim() === "") {
            throw new Error("Groq returned empty blog content");
        }

        // cache generated content
        await setCache(cacheKey, generatedContent, 43200); // Cache for 12 hours
        return {
            content: generatedContent,
            message: "Content generated successfully",
            source: "ai"
        };

    },
    {
        connection: redisWorkerConnection,
        concurrency: 5, // Adjust based on your server's capacity
    }
);

aiWorker.on("completed", (job) => {
    console.log(`AI job completed: ${job.id}`);
});

aiWorker.on("failed", (job, error) => {//! when Job fails
    console.error(JSON.stringify({
        event: "job_failed",
        queue: "aiQueue",
        jobId: job?.id,
        jobName: job?.name,
        attemptsMade: job?.attemptsMade,
        maxAttempts: job?.opts?.attempts,
        error: error.message,
        timestamp: new Date().toISOString()
    }));
});

aiWorker.on("stalled", (jobId) => {//! when Job may be(appears) stuck and is retried by the worker
    console.error(JSON.stringify({
        event: "job_stalled",
        queue: "aiQueue",
        jobId,
        timestamp: new Date().toISOString()
    }));
});//BullMQ may move a stalled job back to waiting so it can be processed again. This is not the same as an ordinary processing failure.

aiWorker.on("error", (error) => {//! when Worker encountered an operational error
    console.error("AI worker error:", error.message);
});

console.log("🤖 AI worker is running");

export default aiWorker;


let isShuttingDown = false;

async function shutdown(signal) {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(`${signal} received. Shutting down AI worker...`);

    try {
        await aiWorker.close();
        console.log("AI Worker closed gracefully");
    } catch (error) {
        console.error("Worker shutdown error:", error.message);
    }

    // Close shared Redis clients only once.
    for (const client of [redis, redisWorkerConnection]) {
        try {
            if (client.status === "ready") {
                await client.quit();
            } else if (client.status !== "end") {
                client.disconnect();
            }
        } catch (error) {
            console.error("Redis worker connection shutdown error:", error.message);
            client.disconnect();
        }
    }
}

process.once("SIGINT", () => shutdown("SIGINT"));// when pressing Ctrl+C in the terminal
process.once("SIGTERM", () => shutdown("SIGTERM"));// when sent by a process manager or orchestrator to request termination