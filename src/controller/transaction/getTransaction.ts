import { Request, Response } from "express";

import getUserIDbyToken from "../../module/getUserIDbyToken";
import prismaClient from "../../module/prismaClient";

import { log } from "console";

export default async function getTransaction(req: Request, res: Response) {
    try {
        const user_id = await getUserIDbyToken(req);
        if (user_id == null) {
            res.json({ code: 400, msg: `กรุณาเข้าสู่ระบบ` });
            return;
        }

        const prisma = await prismaClient();
        const userData = await prisma.user.findUnique({
            where: {
                user_id: user_id,
            }
        });
        if (!userData) {
            res.json({ code: 400, msg: `ไม่มีบัญชีผู้ใช้งานนี้` });
            return;
        }

        const transactionData = await prisma.transaction.findMany({
            where: {
                user_id: user_id,
            },
            orderBy: {
                createAt: 'desc',
            },
        });

        res.json({ code: 200, msg: `ดึงค่ารายการพ้อยสำเร็จ`, transactionData: transactionData });
        return;
    } catch (error) {
        log(`เกิดข้อผิดพลาด: ${error}`);
        res.json({ code: 400, msg: `ดึงค่ารายการพ้อยไม่สำเร็จ` });
        return;
    }
}