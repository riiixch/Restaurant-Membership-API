import { Request, Response, NextFunction } from "express";

import ValidateInput from "../../module/ValidateInput";
import prismaClient from "../../module/prismaClient";
import { decodeJWT } from "../../module/JWT";

import { log } from "console";

export default async function isLogin(req: Request, res: Response, next: NextFunction) {
    try {
        const authenHeader = req.headers.authorization;
        if (!authenHeader) {
            res.json({ code: 400, msg: `ข้อมูลไม่ถูกต้อง` });
            return;
        }

        const authenString = authenHeader.split(' ');
        if (authenString.length !== 2) {
            res.json({ code: 400, msg: `ข้อมูลไม่ถูกต้อง` });
            return;
        }

        const token = authenString[1];
        if (!ValidateInput(token, 'text')) {
            res.json({ code: 400, msg: `กรุณาเข้าสู่ระบบ` });
            return;
        }

        const data = await decodeJWT(token);
        if (!data) {
            res.json({ code: 400, msg: `ข้อมูลไม่ถูกต้อง` });
            return;
        } else
        if (new Date() >= new Date(data.exp)) {
            res.json({ code: 400, msg: `ข้อมูลไม่ถูกต้อง` });
            return;
        }
        
        const prisma = await prismaClient();
        const userData = await prisma.user.findUnique({
            where: {
                user_id: data.user_id,
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