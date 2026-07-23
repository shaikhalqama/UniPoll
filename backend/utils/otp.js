// make a 6 digits OTP

export const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000)); 

// expire time for otp is 10 minutes
export const otpExpiry =  () => new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

// to match the otp with user
export const otpValidate = (user, otp) => user.otp === otp && user.otpExpires && user.otpExpires > new Date();