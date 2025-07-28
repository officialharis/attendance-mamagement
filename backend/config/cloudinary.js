import { v2 as cloudinary } from 'cloudinary';

const cloudinaryConnect = async () => {
    try {
        // Check if all Cloudinary credentials are provided
        if (!process.env.CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET) {
            console.warn("⚠️ Cloudinary credentials not fully configured. Image upload features will be disabled.");
            return;
        }

        // Configure Cloudinary
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        // Test the connection
        await cloudinary.api.ping();
        console.log("Cloudinary Connected Successfully");

    } catch (error) {
        console.error("Cloudinary Connection Failed:", error.message);
        console.warn("Image upload features will be disabled.");
    }
};

export default cloudinaryConnect;