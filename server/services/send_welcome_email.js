import resend from "../configs/resend.js";

async function sendWelcomeEmail({ email, name }) {
    console.log(`Sending welcome email to ${email} with name: ${name}`);
    const safeName = String(name || "there")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

    const { data, error } = await resend.emails.send({
        from: "quickblog <onboarding@resend.dev>",
        to: email,
        subject: "Welcome to QuickBlog!",
        html: `
            <div>
                <h2>Welcome to QuickBlog, ${safeName}!</h2>
                <p>Your account is ready. We're excited to have you here.</p>
                <p>Start exploring blogs, sharing your ideas, and joining the conversation.</p>
                <p>Happy blogging!<br/>The QuickBlog Team</p>
            </div>
        `,
    });

    if (error) {
        throw new Error("Failed to send welcome email");
    }

    return data;
}

export { sendWelcomeEmail };