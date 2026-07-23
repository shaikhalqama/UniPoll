import User from "../models/User.js";
import Poll from "../models/Poll.js";
import Comment from "../models/Comment.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { generateOtp, otpExpiry } from "../utils/otp.js";
import { sendOtpEmail } from "../config/mailer.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "14d" });
const clean = (u) => ({
    _id: u._id,
    name: u.name,
    email: u.email,
    username: u.username,
    avatar: u.avatar,
    bio: u.bio,
})

// to register and send OTP to email
const register = async (req, res) => {
    try {
        const { name, email, username, password } = req.body;
        if (!name || !email || !username || !password)
            return res.status(400).json({ message: "All fields are required" });

        const exist = await User.findOne({ $or: [{ email }, { username }] });
        if (exist)
            return res.status(400).json({ message: "User or email already exists" });

        let avatar = "";
        if (req.file) {
            // to upload image to cloudinary
            try {
                avatar = await uploadToCloudinary(req.file.buffer);
            }
            catch (e) {
                console.warn("Error uploading image to cloudinary:", e.message);
            }
        }

        // to generate OTP
        const otp = generateOtp();
        await User.create({
            name, email, username, password, avatar, otp, otpExpires: otpExpiry()
        });

        // send OTP to email
        await sendOtpEmail(email, otp, "verify your UniPoll account");
        res.status(201).json({ message: "OTP sent to email" });

    }

    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// to verify OTP 
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });
        if (!user.isVerified && otpValid(user, otp))
            return res.status(400).json({ message: "Invalid or expired OTP" });

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        res.status(200).json({ message: "Account verified successfully" });

        // to generate token
        res.json({
            token: makeToken(user._id), user: clean(user) // to exculde password and other sensitive data
        });

    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// to resend OTP to email
export const resendOtp = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ message: "User not found" });
        user.otp = generateOtp();
        user.otpExpires = otpExpiry();

        await user.save();
        await sendOtpEmail(user.email, user.otp, "verify your UniPoll account");
        res.status(200).json({ message: "OTP resent to email" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// to login a user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        if (!user.isVerified) {
            return res.status(403).json({
                message: "Please verify your email first", needVerification: true, email: user.email
            });
        }

        res.json({
            token: makeToken(user._id), user: clean(user) // to exclude password and other sensitive data
        })
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// to update user profile
export const updateProfile = async (req, res) => {
    try {
        const { name, username, bio } = req.body;
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (username && username !== user.username) {
            const taken = await User.findOne({ username });
            if (taken) return res.status(400).json({ message: "Username already taken" });
            user.username = username;
        }
        if (name) user.name = name;
        if (bio !== undefined) user.bio = bio;
        if (req.file) {
            try { user.avatar = await uploadToCloudinary(req.file.buffer); }
            catch (e) { console.warn("Avatar upload skipped:", e.message); }
        }// to upload a new img and save it on cloudinary
        await user.save();// to save the updated user data
        res.json({ user: clean(user) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// to change password
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({ message: "New password must be at least 8 characters " });
        }

        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (!(await user.matchPassword(currentPassword))) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        user.password = newPassword;
        await user.save();
        res.json({ message: "Password changed successfully" });
    }

    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// to delete user account
export const deleteAccount = async (req, res) => {
    try {
        const id = req.userId;
        const myPolls = await Poll.find({ creator: id }).select("_id");
        const PollIds = myPolls.map((p) => p._id);

        await Comment.deleteMany({ $or: [{ user: id }, { poll: { $in: PollIds } }] });
        await Poll.deleteMany({ creator: id });
        await Poll.updateMany({}, { $pull: { votes: { user: id } } });
        await User.findByIdAndDelete(id);

        res.json({ message: "Account deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// to get logged in user profile
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const [created, voted] = await Promise.all([
            Poll.countDocuments({ creator: req.userId }),
            Poll.countDocuments({ "votes.user": req.userId })
        ]);

        res.json({
            user: clean(user),
            stats: {
                created,
                voted,
                bookmarked: user.bookmarked.length
            }
        });

    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}