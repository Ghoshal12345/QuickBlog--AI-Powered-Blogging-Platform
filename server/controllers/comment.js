import Comment from "../models/comment.js";
import { deleteCache } from "../utils/cache.js";

async function addcomment(req, res) {
    try {
        const { content, blogId } = req.body;
        const comment = await Comment.create({
            content,
            blogId,
            createdBy: req.user._id,
            isApproved: false
        });
        // await deleteCache(`blog:${blogId}`);
        await deleteCache("dashboard:stats");
        await deleteCache("admin:comments");

        res.status(201).json({ message: "Comment added for review" });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Error adding comment", error: error.message });
    }
}

async function editComment(req, res) {
    const commentId = req.params.id;
    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        if (comment.createdBy.toString() !== req.user._id.toString()) return res.status(403).json({ message: "You are unauthorized to edit this comment" });

        const { content } = req.body;

        comment.content = content;
        comment.isApproved = false; // Reset approval status after edit
        await comment.save();

        await deleteCache("admin:comments");
        await deleteCache(`blog:${comment.blogId}`);

        // await deleteCache("dashboard:stats");

        res.status(200).json({ message: "Comment updated successfully" });
    } catch (error) {
        console.error("Error updating comment:", error);
        res.status(500).json({ message: "Error updating comment", error: error.message });
    }
}

async function deleteComment(req, res) {
    const commentId = req.params.id;
    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        if (req.user.role !== 'admin' && comment.createdBy.toString() !== req.user._id.toString()) return res.status(403).json({ message: "You are unauthorized to delete this comment" });

        await comment.deleteOne(); // This will trigger the pre hook in the comment model to remove the comment from the blog's comments array

        await deleteCache(`blog:${comment.blogId}`);
        await deleteCache("admin:comments");
        await deleteCache("dashboard:stats");

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: "Error deleting comment", error: error.message });
    }
}
export {
    addcomment,
    editComment,
    deleteComment
}