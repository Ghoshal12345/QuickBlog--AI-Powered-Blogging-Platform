import express from 'express';
import bodyParser from 'body-parser';
import { getAllBlogsAdmin, getAllCommentsAdmin, approveCommentById, getDashboardStats} from '../controllers/admin.js'
import { cookieAuthentication, adminAuthentication } from "../middlewares/authentication.js"
import validate from '../middlewares/validate.js';
import { approveCommentSchema } from '../validators/comment.validator.js';

const adminRouter= express.Router();

adminRouter.use(bodyParser.json());

adminRouter.use(
    cookieAuthentication,
    adminAuthentication
);// Apply authentication middleware to all routes so to not write repeatedly in each route

adminRouter.get('/blogs', getAllBlogsAdmin);
adminRouter.get('/comments', getAllCommentsAdmin);
adminRouter.patch('/comments/:id', validate(approveCommentSchema), approveCommentById);
adminRouter.get('/dashboard', getDashboardStats);

export default adminRouter;