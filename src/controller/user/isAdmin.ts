import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

import ValidateInput from "../../module/ValidateInput";
import { decodeJWT } from "../../module/JWT";

import { log } from "console";

export default async function isAdmin(req: Request, res: Response, next:NextFunction) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token || !ValidateInput(token, 'text')) {
            res.json({ code: 400, msg: `กรุณาเข้าสู่ระบบ` });
            return;
        }

        const data = await decodeJWT(token);
        const user_id = data.user_id;

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

        next();
    } catch (error) {
        log(`เกิดข้อผิดพลาด: ${error}`);
        res.json({ code: 400, msg: `ข้อมูลไม่ถูกต้อง` });
        return;
    }
}