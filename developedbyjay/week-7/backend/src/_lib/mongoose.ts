import mongoose from "mongoose";


import type { ConnectOptions } from "mongoose";

const clientOptions: ConnectOptions = {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
  dbName: "cart-service",
};

export const connectToDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI environment variable is not defined");
    }
    await mongoose.connect(mongoUri, clientOptions);
   
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
   
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
  }
};
