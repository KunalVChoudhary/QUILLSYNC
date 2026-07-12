import * as mongoose from "mongoose";

const connectDB = async () => {
  try {
    const url = process.env.MONGO_URL;

    if (!url) {
      throw new Error("MONGO_URL is not defined");
    }
    await mongoose.connect(url);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;