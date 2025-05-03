import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import getUserIDbyToken from "../../module/getUserIDbyToken";

import { log } from "console";

export default async function getPoint(req:Request, res:Response) {
    try {
        const user_id = await getUserIDbyToken(req);
        if (user_id == null) {
            res.json({ code: 400, msg: `กรุณาเข้าสู่ระบบ` });
            return;
        }

        const prisma = new PrismaClient();
        const userData = await prisma.user.findUnique({
            where: {
                user_id: user_id,
            }
        });
        if (!userData) {
            res.json({ code: 400, msg: `ไม่มีบัญชีผู้ใช้งานนี้` });
            return;
        }

        const pointData = await prisma.transaction.findMany({
            where: {
                user_id: user_id,
            }
        });
        const point = pointData.reduce((a, b) => a + b.tra_point, 0);
        
        res.json({ code: 200, msg: `ดึงค่าพ้อยสำเร็จ`, user_id: user_id, point: point });
        return;
    } catch (error) {
        log(`เกิดข้อผิดพลาด: ${error}`);
        res.json({ code: 400, msg: `ดึงค่าพ้อยไม่สำเร็จ` });
        return;
    }
}