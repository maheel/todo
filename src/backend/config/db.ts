import mongoose from "mongoose";
import { config } from "./env";

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(config.mongoUri);
    // eslint-disable-next-line no-console
    console.log("MongoDB connected");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}
