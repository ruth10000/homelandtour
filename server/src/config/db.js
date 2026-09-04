import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  throw new Error("MONGO_URL environment variable is not defined");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

const connectDB = async () => {
  // Already connected
  if (cached.conn) {
    return cached.conn;
  }

  // Connection is already being created
  if (!cached.promise) {
    const options = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGO_URL, options)
      .then((mongooseInstance) => {
        console.log("MongoDB connected successfully");
        return mongooseInstance;
      })
      .catch((error) => {
        cached.promise = null;
        console.error("MongoDB connection failed:", error);
        throw error;
      });
  }

  cached.conn = await cached.promise;

  return cached.conn;
};

export default connectDB;