import mongoose from "mongoose";

export const connectDB =async (uri: string) => {
    try {
       const conn = await  mongoose.connect(uri, {

    })
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("error connectiing to database: "+ error)
        process.exit(1);
    }
   
}

export const disconnectDB =async () => {
    try {
    await mongoose.connection.close();
    console.log(" MongoDB disconnected");
  } catch (error) {
    console.error(" Error disconnecting from MongoDB: " + error);
  }
   
}