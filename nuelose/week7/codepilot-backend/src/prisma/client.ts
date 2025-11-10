import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

if (!process.env.DATABASE_URL) {
  const envPath = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
  dotenv.config({ path: envPath });
}


const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "test" ? ["error"] : ["query", "error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
