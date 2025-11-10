import * as dotenv from "dotenv";
import { prisma } from "./prisma/client";

process.env.NODE_ENV = "test";
dotenv.config({ path: ".env.test" });


beforeAll(async () => {
  await prisma.$connect();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
