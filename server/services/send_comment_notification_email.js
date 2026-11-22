import resend from "../configs/resend.js";

async function sendCommentNotificationEmail({
    email,
    authorName,
    commenterName,
    blogTitle,
    commentContent,
}) {
    const escapeHTML = (value = "") =>
        String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");

    const { error } = await resend.emails.send({
        from: "quickblog <onboarding@resend.dev>",
        to: email,
        subject: `New comment on your blog: ${blogTitle}`,
        html: `
            <div>
                <h2>Hi ${escapeHTML(authorName)},</h2>
                <p><strong>${escapeHTML(commenterName)}</strong>
                submitted a comment on your blog
                <strong>${escapeHTML(blogTitle)}</strong>.</p>

                <h3>Comment</h3>
                <blockquote>
                    ${escapeHTML(commentContent)}
                </blockquote>

                <p>The comment is awaiting moderation.</p>
                <p>Happy blogging!<br/>The QuickBlog Team</p>
            </div>
        `,
    });

    if (error) {
        throw new Error("Failed to send comment notification email");
    }
}

export { sendCommentNotificationEmail };