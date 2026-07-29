import mongoose from "mongoose";
import 'dotenv/config';

export const connectDB = async () => {
    const mongoURI = process.env.MONGODB_URI || "mongodb+srv://shaikhalqama11_db_user:fxDOr7gifaL0vokA@cluster0.y6thlhi.mongodb.net/Poll";
    await mongoose.connect(mongoURI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
}