
import supertest from "supertest";
import app from "../../src/app";
import {
  connectToDatabase,
  disconnectFromDatabase,
} from "../../src/_lib/mongoose";


export const startTestServer = async () => {
 
  process.env.NODE_ENV = process.env.NODE_ENV || "test";
  process.env.JWT_ACCESS_SECRET =
    process.env.JWT_ACCESS_SECRET || "test-secret";
  process.env.ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || "1d";

  process.env.MONGO_URI =
    process.env.MONGO_URI ||
    "mongodb+srv://user:user@cart.ftqwnrw.mongodb.net/?appName=cart";

  await connectToDatabase();
  return supertest(app);
};

export const stopTestServer = async () => {
  try {
    await disconnectFromDatabase();
    // if (mongoServer) await mongoServer.stop();
    // mongoServer = null;
  } catch (error) {
    console.log(error);
  }
};

export default startTestServer;
