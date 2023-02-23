import { PrismaClient } from "@prisma/client";

const prisma = Global.prisma || new PrismaClient();

if(process.env.NODE_ENV === "development") {
    Global.prisma = prisma;
}

export { prisma };