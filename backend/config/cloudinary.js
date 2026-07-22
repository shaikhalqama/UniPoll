import {v2 as cloudinary} from 'cloudinary';
import multer from 'multer';

// cloudinary configuration key
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// to upload image or  for img
export const upload = multer({ storage: multer.memoryStorage() });

// to upload image to cloudinary
export const uploadToCloudinary = async (buffer) =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {folder:"UniPoll-app"},
            (err, result) => (err ? reject(err) : resolve(result.secure_url))
        );
        stream.end(buffer);
    });

export default cloudinary;