import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.ts";

const connectionString = process.env["DATABASE_URL"];

if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Add it to backend/.env.");
}

const createPrismaClient = (): PrismaClient => {
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
};

// Reuse one client across nodemon/tsx hot reloads instead of exhausting the pool.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (process.env["NODE_ENV"] !== "production") {
  globalForPrisma.prisma = prisma;
}
