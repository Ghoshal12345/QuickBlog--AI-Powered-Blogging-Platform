import Blog from '../models/blog.js';
import Comment from '../models/comment.js';

async function getAllBlogsAdmin(req, res) {
    try {
        const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
        res.status(200).json({ blogs });
    }
    catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({ message: error.message });
    }
}
async function getAllCommentsAdmin(req, res) {
    try {
        const comments = await Comment.find({}).populate('blogId', 'title').populate('createdBy', 'name').sort({ createdAt: -1 }).lean();
        res.status(200).json({ comments });
    }
    catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: error.message });
    }
}

async function deleteCommentById(req, res) {
    try {
        const { id } = req.params;
        const comment = await Comment.findByIdAndDelete(id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: error.message });
    }
}

async function approveCommentById(req, res) {
    try {
        const { id } = req.params;
        const comment = await Comment.findByIdAndUpdate(id, { isApproved: true }, { new: true });
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        res.status(200).json({ message: "Comment approved successfully" });
    } catch (error) {
        console.error("Error approving comment:", error);
        res.status(500).json({ message: error.message });
    }
}

async function getDashboardStats(req, res) {
    try {
        const recentBlogs = await Blog.find({}).sort({ createdAt: -1 });
        const totalBlogs = await Blog.countDocuments({});
        const totalComments = await Comment.countDocuments({});
        const totalDrafts = await Blog.countDocuments({ isPublished: false });
        const dashboardData = {
            recentBlogs,
            totalBlogs,
            totalComments,
            totalDrafts,
        }
        res.status(200).json({ dashboardData });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: error.message });
    }
}
export {
    getAllBlogsAdmin,
    getAllCommentsAdmin,
    getDashboardStats,
    deleteCommentById,
    approveCommentById,
}