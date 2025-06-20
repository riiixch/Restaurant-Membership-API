import { PrismaClient } from "@prisma/client";

export default async function prismaClient() {
    return new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
    });
}