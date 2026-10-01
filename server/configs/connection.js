import mongoose from 'mongoose';

async function connectDB(url){
    try{
        await mongoose.connect(url);
        console.log("🚀 MongoDB connected successfully");
    }
    catch(error){
        console.error("Database connection failed:", error);
        throw error;
    }
}
export default connectDB;