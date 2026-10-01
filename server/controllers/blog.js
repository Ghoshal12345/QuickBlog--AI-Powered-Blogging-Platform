import imageKitClient from '../configs/imagekit.js';
import { toFile } from '@imagekit/nodejs';
import Blog from '../models/blog.js';
import Comment from '../models/comment.js';
import generateContent from '../configs/groqAi.js';
import mongoose from 'mongoose';

async function addBlog(req, res) {
    try {

        // console.log("1. addBlog started");

        const {
            title,
            subTitle,
            description,
            category,
            isPublished
        } = req.body;

        const authorId = req.user._id; // Assuming the authenticated user's ID is stored in req.user

        const imageFile = req.file;

        // console.log("2. Body:", req.body);
        // console.log("3. File:", imageFile);

        if (
            !title ||
            !description ||
            !category ||
            !imageFile ||
            !authorId ||
            typeof isPublished === 'undefined'
        ) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        const imageFileForImageKit = await toFile(
            imageFile.buffer,
            imageFile.originalname
        );

        // console.log("4. Starting ImageKit upload...");

        const response = await imageKitClient.files.upload({
            file: imageFileForImageKit,
            fileName: imageFile.originalname,
        });

        // console.log("5. ImageKit upload completed");
        // console.log(response);

        const optimizedImageUrl = `${response.url}?tr=w-1280,q-auto,f-webp`;

        // console.log("6. Saving blog to MongoDB...");
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

        // console.log("7. Blog saved");

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
        // console.log("1. Fetching all published blogs...");

        const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
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
        const blogs = await Blog.find({ author: userId }).sort({ createdAt: -1 });
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
        const { id } = req.params;
        const blog = await Blog.findById(id);
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
    const { id } = req.params;
    try {

        // Check whether the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }
        const blog = await Blog.findById(id).populate('author', 'name profileImage').lean(); // Use lean() to get a plain JavaScript object

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }
        const comments = await Comment.find({ blogId: id, isApproved: true }).populate('createdBy', 'name profileImage').sort({ createdAt: -1 }).lean();
        // blog.comments= comments;
        // console.log("2. Fetched blog:", blog);
        res.status(200).json({
            blog: {
                ...blog,
                comments
            }
        });
    } catch (error) {
        console.error("Error fetching blog:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function deleteBlog(req, res) {
    const { id } = req.params;

    try {
        // 1. Fetch the blog first inside the try/catch
        const blog = await Blog.findById(id);

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
        await Comment.deleteMany({ blogId: id });


        return res.status(200).json({
            message: "Blog and comments deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting blog:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function toggleBlogPublishStatus(req, res) {
    const { id } = req.body;
    try {
        const blog = await Blog.findById(id);
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
    try {
        const { prompt } = req.body;

        if (!prompt?.trim()) {
            return res.status(400).json({
                message: "Prompt is required"
            });
        }

        const aiPrompt = `
Write a detailed and engaging blog post about:

${prompt}

Generate the blog content as clean HTML that can be directly inserted into a Quill editor.

Use only appropriate HTML tags such as:
<h2>, <h3>, <p>, <strong>, <em>, <ul>, <ol>, <li>.

Do not use Markdown.
Do not include \`\`\`html or \`\`\` code fences.
Return only the HTML content.
`;

        const content = await generateContent(aiPrompt);

        return res.status(200).json({
            message: "Content generated successfully",
            content
        });
    } catch (error) {
        console.error("Error generating content:", error);

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
    generateContentUsingAi
}