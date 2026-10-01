import express from 'express';
import bodyParser from 'body-parser';
import { getAllBlogsAdmin, getAllCommentsAdmin,deleteCommentById, approveCommentById, getDashboardStats} from '../controllers/admin.js'
import { cookieAuthentication, adminAuthentication } from "../middlewares/authentication.js"

const adminRouter= express.Router();

adminRouter.use(bodyParser.json());

adminRouter.use(
    cookieAuthentication,
    adminAuthentication
);// Apply authentication middleware to all routes so to not write repeatedly in each route

adminRouter.get('/blogs', getAllBlogsAdmin);
adminRouter.get('/comments', getAllCommentsAdmin);
adminRouter.delete('/comments/:id', deleteCommentById);
adminRouter.patch('/comments/:id', approveCommentById);
adminRouter.get('/dashboard', getDashboardStats);

export default adminRouter;