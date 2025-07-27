import mongoose from "mongoose";
import constants from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(constants.MONGO_URI, {
            dbName: constants.DB_NAME,
        });

        console.log(`MongoDB Connected: ${connectionInstance.connection.host}`);
    } catch (error: any) {
        console.log(
            "Error while connecting to MongoDB: ",
            error.errorResponse.errmsg
        );
    }
};

export default connectDB;
