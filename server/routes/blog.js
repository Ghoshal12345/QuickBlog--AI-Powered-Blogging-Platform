import express from 'express';
import upload from '../middlewares/multer.js';
import { cookieAuthentication } from '../middlewares/authentication.js';
import { addBlog, getAllBlogs, getBlogById, getMyBlogs, editBlog , deleteBlog, toggleBlogPublishStatus,generateContentUsingAi  } from '../controllers/blog.js';
import { addcomment, editComment, deleteComment } from '../controllers/comment.js';

const BlogRouter= express.Router();

//public
BlogRouter.get('/all', getAllBlogs);
BlogRouter.get('/id/:id', getBlogById);

//Authenticated users
BlogRouter.post('/add', cookieAuthentication, upload.single('image'), addBlog);
BlogRouter.get('/my-blogs', cookieAuthentication, getMyBlogs);
BlogRouter.patch('/id/:id', cookieAuthentication, upload.single('image'), editBlog);
BlogRouter.delete('/id/:id', cookieAuthentication, deleteBlog);
BlogRouter.post('/add-comment', cookieAuthentication, addcomment);
BlogRouter.patch('/comment/:id', cookieAuthentication, editComment);
BlogRouter.delete('/comment/:id', cookieAuthentication, deleteComment);
BlogRouter.post('/generate-content', cookieAuthentication, generateContentUsingAi);
BlogRouter.patch('/toggle-publish', cookieAuthentication, toggleBlogPublishStatus);

export default BlogRouter;


// learn all the HTTP headers and methods and status codes and their meanings. Learn about RESTful API design principles. Learn about Express.js routing and middleware. Learn about authentication and authorization in web applications. Learn about file uploads in web applications. Learn about error handling in Express.js.  
/*
GET     → retrieve data                                 GET     /blogs/all  ,   GET     /blogs/id/:id
POST    → create/submit something                       POST    /blogs/add
PUT     → replace an entire resource
PATCH   → partially modify a resource                   PATCH   /blogs/toggle-publish
DELETE  → delete a resource                             DELETE  /blogs/id/:id
*/