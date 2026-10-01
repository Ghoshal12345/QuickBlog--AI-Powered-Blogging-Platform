import Comment from "../models/comment.js";

async function addcomment(req, res) {
    try {
        const { content, blogId } = req.body;
        if (!content || !blogId) {
            return res.status(400).json({ message: "something is missing" });
        }
        const comment = await Comment.create({
            content,
            blogId,
            createdBy: req.user._id,
            isApproved: false
        });
        res.status(201).json({ message: "Comment added for review" });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Error adding comment", error: error.message });
    }
}

async function editComment(req, res) {
    const { id } = req.params;
    try{
        const comment = await Comment.findById(id);
        if(!comment){
            return res.status(404).json({ message: "Comment not found" });
        }
        if(comment.createdBy.toString() !== req.user._id.toString()) return res.status(403).json({ message: "You are unauthorized to edit this comment" });
        const { content } = req.body;
        if(!content) return res.status(400).json({ message: "Content is required" });
        comment.content = content;
        comment.isApproved = false; // Reset approval status after edit
        await comment.save();
        res.status(200).json({ message: "Comment updated successfully" });
    }catch(error){
        console.error("Error updating comment:", error);
        res.status(500).json({ message: "Error updating comment", error: error.message });
    }
}

async function deleteComment(req, res) {
    const { id } = req.params;
    try{
        const comment = await Comment.findById(id);
        if(!comment){
            return res.status(404).json({ message: "Comment not found" });
        }
        if(comment.createdBy.toString() !== req.user._id.toString()) return res.status(403).json({ message: "You are unauthorized to delete this comment" });
        // const deletedComment = await Comment.findByIdAndDelete(id);
        await comment.deleteOne(); // This will trigger the pre hook in the comment model to remove the comment from the blog's comments array
        // await comment.remove(); //it doesn't work because of the pre hook in comment model, so we are using findByIdAndDelete instead
        res.status(200).json({ message: "Comment deleted successfully" });
    }catch(error){
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: "Error deleting comment", error: error.message });
    }
}
export {
    addcomment,
    editComment,
    deleteComment
}