import { connectTestDB, disconnectTestDB } from "./mongodb-memory-server";

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});
