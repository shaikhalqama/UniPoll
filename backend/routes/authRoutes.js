import express from 'express';
import { upload } from '../config/cloudinary.js';
import { login, register, verifyOtp, resendOtp, getMe, updateProfile, changePassword, deleteAccount } from '../controllers/authController.js';
import { forgotPassword, verifyResetOtp, resetPassword } from '../controllers/passwordController.js';
import { protect } from '../middleware/auth.js';

const authRouter = express.Router();

authRouter.post('/register',upload.single("image"), register);
authRouter.post('/verify-otp', verifyOtp);
authRouter.post('/resend-otp', resendOtp);

authRouter.post('/login', login);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/verify-reset-otp', verifyResetOtp);

authRouter.post('/reset-password', resetPassword);
authRouter.get('/me', protect, getMe);

authRouter.patch('/profile', protect, upload.single("image"), updateProfile);
authRouter.patch('/password', protect, changePassword);
authRouter.delete('/account', protect, deleteAccount);

export default authRouter;
