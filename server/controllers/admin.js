import Blog from '../models/blog.js';
import Comment from '../models/comment.js';
import { setCache, getCache, deleteCache } from '../utils/cache.js';
import { emailQueue } from '../queues/email_queue.js';

async function getAllBlogsAdmin(req, res) {
    try {
        const cacheKey = "admin:blogs";
        const cachedBlogs = await getCache(cacheKey);
        if (cachedBlogs) {
            return res.status(200).json({ blogs: cachedBlogs });
        }
        const blogs = await Blog.find({}).select("_id title createdAt isPublished").sort({ createdAt: -1 }).lean();
        await setCache(cacheKey, blogs, 300);
        res.status(200).json({ blogs });
    }
    catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({ message: error.message });
    }
}
async function getAllCommentsAdmin(req, res) {
    try {
        const cacheKey = "admin:comments";
        const cachedComments = await getCache(cacheKey);
        if (cachedComments) {
            return res.status(200).json({ comments: cachedComments });
        }
        const comments = await Comment.find({}).populate('blogId', 'title').populate('createdBy', 'name').sort({ createdAt: -1 }).lean();
        await setCache(cacheKey, comments, 300);
        res.status(200).json({ comments });
    }
    catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: error.message });
    }
}


async function approveCommentById(req, res) {
    try {
        const commentId = req.params.id;
        const comment = await Comment.findByIdAndUpdate(commentId, { isApproved: true }, { new: true });
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        await deleteCache(`blog:${comment.blogId}`);
        await deleteCache("admin:comments");

        // Fetch the blog and it's author
        const blog = await Blog.findById(comment.blogId).populate({ path: "author", select: "name email" });//*_id is included by default
        const commenter= await Comment.findById(comment._id).populate({ path: "createdBy", select: "name" });
        if (blog && blog.author) {
            const isAuthorCommenting = blog.author._id.toString() === comment.createdBy.toString();

            if (!isAuthorCommenting) {
                // Add a job to the email queue to send a notification to the blog author
                try {
                    const job = await emailQueue.add(
                        "sendCommentNotificationEmail",
                        {
                            email: blog.author.email,
                            authorName: blog.author.name,
                            commenterName: commenter.createdBy.name,
                            blogTitle: blog.title,
                            commentContent: comment.content,
                        },
                        {
                            jobId: `comment-notification-${comment._id}-${Date.now()}`, // Unique job ID to prevent duplicates
                        }
                    );
                    console.log(`Added email job for comment notification: ${job.id}`);
                } catch (error) {
                    console.error(`Failed to add email job for comment notification: ${error.message}`);
                }
            }
        }
        
        res.status(200).json({ message: "Comment approved successfully" });
    } catch (error) {
        console.error("Error approving comment:", error);
        res.status(500).json({ message: error.message });
    }
}

async function getDashboardStats(req, res) {
    try {
        const cacheKey = "dashboard:stats";
        // Check Redis
        const cachedData = await getCache(cacheKey);
        if (cachedData) {
            return res.status(200).json({
                dashboardData: cachedData
            });
        }

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
        // Store in Redis for 5 minutes
        await setCache(cacheKey, dashboardData, 300);

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
    approveCommentById,
}