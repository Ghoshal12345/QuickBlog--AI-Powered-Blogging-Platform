import imageKitClient from '../configs/imagekit.js';
import { toFile } from '@imagekit/nodejs';
import Blog from '../models/blog.js';
import Comment from '../models/comment.js';
import { getCache, setCache, deleteCache } from '../utils/cache.js';
import { aiQueue } from '../queues/ai_queue.js';
import { redisProducerConnection } from '../configs/redisProducer.js';

async function addBlog(req, res) {
    try {

        const {
            title,
            subTitle,
            description,
            category,
            isPublished
        } = req.body;

        const authorId = req.user._id; // Assuming the authenticated user's ID is stored in req.user

        const imageFile = req.file;


        // if (
        //     !title ||
        //     !description ||
        //     !category ||
        //     !imageFile ||
        //     !authorId ||
        //     typeof isPublished === 'undefined'
        // ) {
        //     return res.status(400).json({
        //         message: "Missing required fields"
        //     });
        // }

        const imageFileForImageKit = await toFile(
            imageFile.buffer,
            imageFile.originalname
        );


        const response = await imageKitClient.files.upload({
            file: imageFileForImageKit,
            fileName: imageFile.originalname,
        });

        console.log("Uploaded file:", req.file?.originalname);
        console.log("ImageKit URL:", response.url);
        console.log("ImageKit file ID:", response.fileId);

        const optimizedImageUrl = `${response.url}?tr=w-1280,q-auto,f-webp`;

        const published = isPublished === 'true' || isPublished === true;
        const blog = await Blog.create({
            title,
            subTitle,
            description,
            category,
            image: optimizedImageUrl,
            imageFileId: response.fileId,
            isPublished: published,
            author: authorId
        });

        await deleteCache("blogs:all"); // Invalidate the cache for all blogs
        await deleteCache("admin:blogs");
        await deleteCache(`myblogs:${req.user._id}`); // Invalidate the cache for the author's blogs
        await deleteCache("dashboard:stats");

        return res.status(201).json({
            blog,
            message: "Blog added successfully"
        });

    } catch (error) {
        console.error("Error adding blog:", error);
        return res.status(500).json({
            message: error.message || "Internal server error"
        });
    }
}

async function getAllBlogs(req, res) {
    try {
        const cacheKey = "blogs:all";

        // 1. Check if the blogs are cached in Redis
        const cachedBlogs = await getCache(cacheKey);
        if (cachedBlogs) {
            return res.status(200).json({
                blogs: cachedBlogs,
            })
        }

        // 2. Cache miss → get data from MongoDB
        const blogs = await Blog.find({ isPublished: true })
            .select("_id title subTitle description image category")
            .sort({ createdAt: -1 })
            .lean();

        // store result in redis
        await setCache(cacheKey, blogs, 300); // Cache for 5 minutes

        res.status(200).json({
            blogs
        });

        // console.log("2. Fetched blogs:", blogs);
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return res.status(500).json({
            message: error.message || "Internal server error"
        });
    }
}

async function getMyBlogs(req, res) {
    try {
        const userId = req.user._id;

        const cacheKey = `myblogs:${userId}`;
        const cachedBlogs = await getCache(cacheKey);
        if (cachedBlogs) {
            return res.status(200).json({ blogs: cachedBlogs });
        }

        const blogs = await Blog.find({ author: userId })
            .select("_id title subTitle description category image isPublished")
            .sort({ createdAt: -1 })
            .lean();
        await setCache(cacheKey, blogs, 300);
        res.status(200).json({
            blogs
        });
    } catch (error) {
        console.error("Error fetching my blogs:", error);
        return res.status(500).json({
            message: error.message || "Internal server error"
        });
    }
}

async function editBlog(req, res) {

    try {
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        // Check whether the logged-in user owns this blog
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not allowed to edit this blog"
            });
        }

        const {
            title,
            subTitle,
            description,
            category,
            isPublished
        } = req.body;

        // Update text/content fields
        blog.title = title;
        blog.subTitle = subTitle;
        blog.description = description;
        blog.category = category;

        // Convert FormData string "true"/"false" into boolean
        blog.isPublished = isPublished === 'true' || isPublished === true;


        // If user selected a new image
        if (req.file) {
            const oldImageFileId = blog.imageFileId;
            const imageFileForImageKit = await toFile(
                req.file.buffer,
                req.file.originalname
            );

            const response = await imageKitClient.files.upload({
                file: imageFileForImageKit,
                fileName: req.file.originalname,
            });

            const optimizedImageUrl =
                `${response.url}?tr=w-1280,q-auto,f-webp`;
            blog.image = optimizedImageUrl;
            blog.imageFileId = response.fileId;

            // Delete the old image from ImageKit
            if (oldImageFileId) {
                try {
                    await imageKitClient.files.delete(oldImageFileId);
                } catch (imgError) {
                    console.error("ImageKit deletion failed:", imgError.message || imgError);
                }
            }
        }
        await blog.save();

        await deleteCache("blogs:all"); // Invalidate the cache for all blogs
        await deleteCache("admin:blogs");
        await deleteCache(`blog:${blogId}`); // Invalidate the cache for this specific blog 
        await deleteCache(`myblogs:${blog.author}`); // Invalidate the cache for the author's blogs
        await deleteCache("dashboard:stats");

        return res.status(200).json({
            message: "Blog updated successfully",
            blog
        });

    } catch (error) {
        console.error("Error editing blog:", error);
        return res.status(500).json({
            message: error.message || "Internal server error"
        });
    }
}

async function getBlogById(req, res) {
    // console.log("1. Fetching blog by ID...");
    const blogId = req.params.id;
    try {

        const cacheKey = `blog:${blogId}`;
        const cachedBlog = await getCache(cacheKey);
        if (cachedBlog) {
            return res.status(200).json({
                blog: cachedBlog,
                message: "Blog fetched from cache"
            })
        }
        const blog = await Blog.findOne({ _id: blogId, isPublished: true })
            .select("_id title subTitle description image isPublished createdAt updatedAt")
            .populate('author', 'name profileImage')
            .lean(); // Use lean() to get a plain JavaScript object

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }
        const comments = await Comment.find({ blogId: blogId, isApproved: true }).populate('createdBy', 'name profileImage').sort({ createdAt: -1 }).lean();

        const blogData = {
            ...blog,
            comments
        };
        await setCache(cacheKey, blogData, 300); // Cache for 5 minutes
        res.status(200).json({
            blog: blogData
        });
    } catch (error) {
        console.error("Error fetching blog:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function deleteBlog(req, res) {
    const blogId = req.params.id;

    try {
        // 1. Fetch the blog first inside the try/catch
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // 2. Authorize: allow if admin OR if the author matches
        const isOwner = blog.author.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isAdmin && !isOwner) {
            return res.status(403).json({
                message: "You are not allowed to delete this blog"
            });
        }

        // Delete image from ImageKit
        if (blog.imageFileId) {
            try {
                await imageKitClient.files.delete(blog.imageFileId);
            } catch (imgError) {
                console.error(
                    "ImageKit deletion failed:",
                    imgError.message || imgError
                );
            }
        }

        // Delete the blog and its associated comments
        await blog.deleteOne();
        await Comment.deleteMany({ blogId: blogId });

        await deleteCache("blogs:all"); // Invalidate the cache for all blogs
        await deleteCache("admin:blogs");
        await deleteCache(`blog:${blogId}`); // Invalidate the cache for this specific blog
        await deleteCache(`myblogs:${blog.author}`); // Invalidate the cache for the author's blogs
        await deleteCache("dashboard:stats");


        return res.status(200).json({
            message: "Blog and comments deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting blog:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function toggleBlogPublishStatus(req, res) {
    const blogId = req.body.id;
    try {
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }
        // Admin can publish/unpublish any blog
        // Normal user can only publish/unpublish their own blog
        if (
            req.user.role !== "admin" &&
            blog.author.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "You are not allowed to change this blog's publish status"
            });
        }
        blog.isPublished = !blog.isPublished;

        await blog.save();
        await deleteCache("blogs:all"); // Invalidate the cache for all blogs
        await deleteCache("admin:blogs");
        await deleteCache(`blog:${blogId}`); // Invalidate the cache for this specific blog
        await deleteCache(`myblogs:${blog.author}`); // Invalidate the cache for the author's blogs
        await deleteCache("dashboard:stats");

        return res.status(200).json({
            message: "Blog publish status toggled successfully",
            isPublished: blog.isPublished
        });
    } catch (error) {
        console.error("Error toggling blog publish status:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function generateContentUsingAi(req, res) {
    if(redisProducerConnection.status !== "ready"){
        console.error("Redis producer connection is not ready. Current status:", redisProducerConnection.status);
        return res.status(503).json({
            message: "Service unavailable. Please try again later."
        });
    }
    try {
        const { prompt } = req.body;
        // const cleanPrompt = prompt.trim();
        const job = await aiQueue.add(
            "generateContent",// Job name
            { prompt: prompt.trim(), userId: req.user._id.toString() },// Job data
            {
                jobId: `generateContent-${req.user._id}-${Date.now()}`// Unique job ID
            }
        )
        console.log(`AI generation job queued: ${job.id}, type: ${job.name}`);
        return res.status(202).json({
            message: "AI blog generation queued successfully",
            jobId: job.id,
            status: "queued",
        });
    } catch (error) {
        console.error("Failed to enqueue AI job:", error);
        return res.status(500).json({
            message: "Unable to queue AI generation. Please try again shortly."
        });
    }
}

async function getAiJobStatus(req, res) {
    try {
        const jobId = req.params.jobId;
        const job = await aiQueue.getJob(jobId);
        if (!job) {
            return res.status(404).json({
                message: "AI generation job not found or expired"
            });
        }

        // A user should only retrive their own 
        if (job.data.userId !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to view this job's status"
            });
        }

        const state = await job.getState();

        if (state === "completed") {
            return res.status(200).json({
                status: "completed",
                content: job.returnvalue.content,
                message: job.returnvalue.message || "Content generated successfully",
                source: job.returnvalue.source || "AI generation"//* what is source: source is the origin of the content, whether it was generated by AI or retrieved from cache.
            });
        }

        else if (state === "failed") {
            return res.status(200).json({
                status: "failed",
                message: job.failedReason || "AI generation failed after retries. Please try again."
            });
        }

        return res.status(200).json({
            status: state==="active" ? "processing" : "queued",
        })

    } catch (error) {
        console.error("Error checking AI job status:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export {
    addBlog,
    getAllBlogs,
    getMyBlogs,
    getBlogById,
    editBlog,
    deleteBlog,
    toggleBlogPublishStatus,
    generateContentUsingAi,
    getAiJobStatus
}