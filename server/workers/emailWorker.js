import "dotenv/config";
import { Worker } from "bullmq";
import { redisWorkerConnection } from "../configs/redisWorker.js";
import { sendOtpEmail } from "../services/sendOTPEmail.js";
import { sendWelcomeEmail } from "../services/send_welcome_email.js";
import { sendPasswordChangedEmail } from "../services/send_password_changed_email.js";
import { sendCommentNotificationEmail } from "../services/send_comment_notification_email.js";

const emailWorker = new Worker(
    "emailQueue",// queue from which the worker will pick the job
    async (job) => {
        console.log(`Processing ${job.name} job: ${job.id}`);
        switch (job.name) {
            case "sendOtp":
                await sendOtpEmail(job.data);
                break;
            case "sendWelcomeEmail":
                await sendWelcomeEmail(job.data);
                break;
            case "sendPasswordChangedEmail":
                await sendPasswordChangedEmail(job.data);
                break;
            case "sendCommentNotificationEmail":
                await sendCommentNotificationEmail(job.data);
                break;
            default:
                throw new Error(`Unknown email job type: ${job.name}`);
        }
    },
    {
        connection: redisWorkerConnection,//from which redis connection the worker will pick the job
        concurrency: 10,
    }
);


emailWorker.on("completed", (job) => {
    console.log(`Email job completed: ${job.id}`);
});

emailWorker.on("failed", (job, error) => {//! when Job fails
    console.error(JSON.stringify({
        event: "job_failed",
        queue: "emailQueue",
        jobId: job?.id,
        jobName: job?.name,
        attemptsMade: job?.attemptsMade,
        maxAttempts: job?.opts?.attempts,
        error: error.message,
        timestamp: new Date().toISOString()
    }));
});

emailWorker.on("stalled", (jobId) => {//! when Job may be(appears) stuck and is retried by the worker
    console.error(JSON.stringify({
        event: "job_stalled",
        queue: "emailQueue",
        jobId,
        timestamp: new Date().toISOString()
    }));
});//BullMQ may move a stalled job back to waiting so it can be processed again. This is not the same as an ordinary processing failure.

emailWorker.on("error", (error) => {//! when Worker encountered an operational error
    console.error("Email worker error:", error.message);
});



console.log("📧 Email worker is running");

export default emailWorker;


let isShuttingDown = false;

async function shutdown(signal) {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(`${signal} received. Shutting down Email worker...`);

    try {
        await emailWorker.close();
        console.log("Email worker closed gracefully");
    } catch (error) {
        console.error("Worker shutdown error:", error.message);
    }


    try {//emailWorker doesn't need to close the redis cuz aiWorker uses cache redis
        if (redisWorkerConnection.status === "ready") {
            await redisWorkerConnection.quit();
        } else if (redisWorkerConnection.status !== "end") {
            redisWorkerConnection.disconnect();
        }
    } catch (error) {
        console.error("Redis worker connection shutdown error:", error.message);
        redisWorkerConnection.disconnect();
    }
}

process.once("SIGINT", () => shutdown("SIGINT"));// when pressing Ctrl+C in the terminal
process.once("SIGTERM", () => shutdown("SIGTERM"));// when sent by a process manager or orchestrator to request termination