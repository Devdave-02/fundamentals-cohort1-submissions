import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./app";
import { seedSampleData } from "./seed";

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const start = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
    // Seed sample data in dev
    if (process.env.NODE_ENV !== "test") {
      await seedSampleData();
    }
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
};

start();
