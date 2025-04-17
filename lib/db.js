import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/resq-connect"; // Replace 'resq-connect' with your DB name

export const connectToDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return; // Avoid multiple connections
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Locally");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1); // Exit the process if connection fails
  }
};
