import User from "../models/User.js";
import Poll from "../models/Poll.js";
import Comment from "../models/Comment.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

// to register and send OTP to email
const register = async (req, res) => {
    try{
    const { name, email, username, password } = req.body;
    if(!name || !email || !username || !password)
        return res.status(400).json({ message: "All fields are required" });

        const exist = await User.findOne({$or: [{ email }, { username }]});
        if(exist)
            return res.status(400).json({ message: "User or email already exists" });
        
        let avatar = "";
        if(req.file){
            // to upload image to cloudinary
           try{
            avatar = await uploadToCloudinary(req.file.buffer);
           }
           catch(e){
            console.warn("Error uploading image to cloudinary:", e.message);
           }
        }  
        
        // to generate OTP
        

    }

    catch (error){
        res.status(500).json({ message: error.message });
    }
  }

