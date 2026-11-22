import resend from "../configs/resend.js";

async function sendOtpEmail({ email, otp, purpose }) {
    const { data, error } = await resend.emails.send({
        from: "quickblog <onboarding@resend.dev>",
        to: email,
        subject:
            purpose === "signup"
                ? "Verify your QuickBlog account"
                : purpose === "email-change"
                    ? "Verify your new QuickBlog email"
                    : "Reset your QuickBlog password",
        html: `
        <div>
            <p>Your verification code is:</p>
            <h1>${otp}</h1>
            <p>This code will expire in 10 minutes.</p>
            <p>If you did not request this code, you can ignore this email.</p>
        </div>
        `,
    });

    if (error) {
        throw new Error("Failed to send OTP email");
    }

    return data;
}

export { sendOtpEmail };