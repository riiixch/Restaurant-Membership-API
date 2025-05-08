import { Request, Response } from "express";

import getUserIDbyToken from "../../module/getUserIDbyToken";
import ValidateInput from "../../module/ValidateInput";
import prismaClient from "../../module/prismaClient";

import { log } from "console";

export default async function checkAdmin(req: Request, res: Response) {
    try {
        const user_id = await getUserIDbyToken(req);
        if (!user_id || !ValidateInput(user_id, 'text')) {
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

        res.json({ code: 200, msg: `คุณมีสิทธิ์ของแอดมิน`, isAdmin: userData.role === 'admin' });
        return;
    } catch (error) {
        log(`เกิดข้อผิดพลาด: ${error}`);
        res.json({ code: 400, msg: `ข้อมูลไม่ถูกต้อง` });
        return;
    }
}