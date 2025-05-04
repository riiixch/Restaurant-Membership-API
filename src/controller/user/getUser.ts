import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import { log } from "console";

export default async function getUser(req:Request, res:Response) {
    try {
        const prisma = new PrismaClient();
        const userData = await prisma.user.findMany({
            select: {
                user_id: true,
                username: true,
                email: true,
                phone: true,
                fname: true,
                lname: true,
                profile: true,
            }
        });
        
        res.json({ code: 200, msg: `ดึงข้อมูลสมาชิกสำเร็จ`, userData: userData });
        return;
    } catch (error) {
        log(`เกิดข้อผิดพลาด: ${error}`);
        res.json({ code: 400, msg: `ดึงข้อมูลสมาชิกไม่สำเร็จ` });
        return;
    }
}