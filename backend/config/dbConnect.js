import mongoose from "mongoose";

const connectDatabase = async () => {
    try {
        // Check if MONGODB_URL is configured
        if (!process.env.MONGODB_URL) {
            console.error("MONGODB_URL is not configured in environment variables");
            process.exit(1);
        }

        // Set up connection event listeners
        mongoose.connection.on("connected", () => {
            console.log("Database Connected Successfully");
        });

        mongoose.connection.on("error", (err) => {
            console.error("Database Connection Error:", err);
        });

        mongoose.connection.on("disconnected", () => {
            console.log("Database Disconnected");
        });

        // Connect to MongoDB
        const connectionString = process.env.MONGODB_URL;

        console.log("Attempting to connect to:", connectionString?.replace(/\/\/.*:.*@/, '//***:***@') || 'undefined');

        if (connectionString?.includes('mongodb+srv://')) {
            console.log("Using MongoDB Atlas - ensure your IP is whitelisted");
        }

        await mongoose.connect(connectionString);

    } catch (error) {
        console.error("Database Connection Failed:", error.message);

        // Provide specific guidance for common issues
        if (error.message.includes('IP that isn\'t whitelisted')) {
            console.error("\n🔧 SOLUTION: MongoDB Atlas IP Whitelist Issue");
            console.error("1. Go to https://cloud.mongodb.com/");
            console.error("2. Select your project and cluster");
            console.error("3. Click 'Network Access' in the left sidebar");
            console.error("4. Click 'Add IP Address'");
            console.error("5. Either:");
            console.error("   - Click 'Add Current IP Address' (recommended)");
            console.error("   - Or enter 0.0.0.0/0 to allow all IPs (not secure)");
            console.error("6. Click 'Confirm'");
            console.error("7. Wait 1-2 minutes for changes to take effect");
            console.error("\n🌐 Your current public IP can be found at: https://whatismyipaddress.com/");
        } else if (error.message.includes('authentication failed')) {
            console.error("\n🔧 SOLUTION: Check your MongoDB credentials in .env file");
        } else if (error.message.includes('ENOTFOUND')) {
            console.error("\n🔧 SOLUTION: Check your internet connection and MongoDB URL");
        } else if (error.message.includes('Invalid scheme')) {
            console.error("\n🔧 SOLUTION: Check your MONGODB_URL format in .env file");
            console.error("Should start with 'mongodb://' or 'mongodb+srv://'");
        }

        console.error("\n💡 To use local MongoDB instead:");
        console.error("1. Install MongoDB locally");
        console.error("2. Update MONGODB_URL in .env to: mongodb://localhost:27017/attendance");

        process.exit(1);
    }
};

export default connectDatabase;