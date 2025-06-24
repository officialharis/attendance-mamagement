import mongoose from "mongoose";

const connectDatabase=async (params) => {
    try {
        mongoose.connection.on("connected",()=>console.log("Database Is Connected"))
        await mongoose.connect(`${process.env.MONGODB_URL}/attendance`)
    } catch (error) {
        console.error(error)
    }
}

export default connectDatabase;