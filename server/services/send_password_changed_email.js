import resend from "../configs/resend.js";

async function sendPasswordChangedEmail({ email, name }) {
    console.log(`Sending password changed email to ${email} with name: ${name}`);
    const safeName = String(name || "there")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

    const { data, error } = await resend.emails.send({
        from: "quickblog <onboarding@resend.dev>",
        to: email,
        subject: "Your QuickBlog password was changed",
        html: `
            <div>
                <h2>Password changed successfully</h2>
                <p>Hi ${safeName},</p>
                <p>Your QuickBlog account password was recently changed.</p>
                <p>If you made this change, no further action is needed.</p>
                <p>If you did not change your password, please reset it
                immediately and secure your account.</p>
                <p>The QuickBlog Team</p>
            </div>
        `,
    });

    if (error) {
        throw new Error("Failed to send password-change confirmation email");
    }

    return data;
}

export { sendPasswordChangedEmail };