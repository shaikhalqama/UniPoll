import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://shaikhalqama11_db_user:fxDOr7gifaL0vokA@cluster0.y6thlhi.mongodb.net/Poll")
    .then(() => {
        console.log("MongoDB connected successfully");
    })
}