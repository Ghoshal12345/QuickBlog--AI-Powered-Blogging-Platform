import 'dotenv/config'; //write this line at the top of the file to load environment variables from .env file
import express from 'express';
import cors from 'cors';
import connectDB from './configs/connection.js';
import adminRouter from './routes/admin.js';
import BlogRouter from './routes/blog.js';
import userRouter from './routes/user.js';
import cookieParser from 'cookie-parser';

const app = express();

// middlewares 
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.get('/', (req, res) => {
    res.send("hello world");
});
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);
app.use('/api/blog', BlogRouter);


// server and DB connection
const PORT = process.env.PORT || 8005;
const startServer = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, () => {
            console.log(`🚀 Server started on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
    }
}
startServer();