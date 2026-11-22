import express from 'express';
import upload from '../middlewares/multer.js';
import { cookieAuthentication } from '../middlewares/authentication.js';
import { addBlog, getAllBlogs, getBlogById, getMyBlogs, editBlog, deleteBlog, toggleBlogPublishStatus, generateContentUsingAi, getAiJobStatus } from '../controllers/blog.js';
import { addcomment, editComment, deleteComment } from '../controllers/comment.js';
import { aiLimiter } from '../middlewares/rate_limiter.js';
import validate from '../middlewares/validate.js';
import { addBlogSchema, editBlogSchema, blogIdParamSchema, generateContentSchema, togglePublishSchema } from '../validators/blog.validator.js';
import { addCommentSchema, editCommentSchema, deleteCommentSchema } from '../validators/comment.validator.js';

const requireBlogImage = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({
            message: 'Blog image is required',
            errors: [{
                field: 'image',
                message: 'Blog image is required.'
            }]
        });
    }
    next();
}

const BlogRouter = express.Router();

//public
BlogRouter.get('/all', getAllBlogs);
BlogRouter.get('/id/:id', validate(blogIdParamSchema), getBlogById);

//Authenticated blog routes
BlogRouter.post('/add', cookieAuthentication,  upload.single('image'), requireBlogImage, validate(addBlogSchema), addBlog);
BlogRouter.get('/my-blogs', cookieAuthentication, getMyBlogs);
BlogRouter.patch('/id/:id', cookieAuthentication, upload.single('image'), validate(editBlogSchema), editBlog);
BlogRouter.delete('/id/:id', cookieAuthentication, validate(blogIdParamSchema), deleteBlog);

//comment routes
BlogRouter.post('/add-comment', cookieAuthentication, validate(addCommentSchema), addcomment);
BlogRouter.patch('/comment/:id', cookieAuthentication, validate(editCommentSchema), editComment);
BlogRouter.delete('/comment/:id', cookieAuthentication, validate(deleteCommentSchema), deleteComment);
//AI content generation
BlogRouter.post('/generate-content', cookieAuthentication, aiLimiter, validate(generateContentSchema), generateContentUsingAi);
BlogRouter.get('/generate-content/status/:jobId', cookieAuthentication, getAiJobStatus);
BlogRouter.patch('/toggle-publish', cookieAuthentication, validate(togglePublishSchema), toggleBlogPublishStatus);

export default BlogRouter;


// learn all the HTTP headers and methods and status codes and their meanings. Learn about RESTful API design principles. Learn about Express.js routing and middleware. Learn about authentication and authorization in web applications. Learn about file uploads in web applications. Learn about error handling in Express.js.  
/*
GET     → retrieve data                                 GET     /blogs/all  ,   GET     /blogs/id/:id
POST    → create/submit something                       POST    /blogs/add
PUT     → replace an entire resource
PATCH   → partially modify a resource                   PATCH   /blogs/toggle-publish
DELETE  → delete a resource                             DELETE  /blogs/id/:id
*/