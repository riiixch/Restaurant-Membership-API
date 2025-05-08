import { Request, Response } from "express";

import ValidateInput from "../../module/ValidateInput";
import prismaClient from "../../module/prismaClient";
import { decodeJWT } from "../../module/JWT";

import { log } from "console";

export default async function getUserData(req: Request, res:Response) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token || !ValidateInput(token, 'text')) {
            res.json({ code: 400, msg: `กรุณาเข้าสู่ระบบ` });
            return;
        }

        const data = await decodeJWT(token);
        const user_id = data.user_id;

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

        const user = {
            user_id: userData.user_id,
            username: userData.username,
            email: userData.email,
            phone: userData.phone,
            fname: userData.fname,
            lname: userData.lname,
            profile: userData.profile,
            role: userData.role,
            createAt: userData.createAt,
        }

        res.json({ code: 200, msg: `ดึงข้อมูลผู้ใช้งานสำเร็จ`, user: user });
        return;
    } catch (error) {
        log(`เกิดข้อผิดพลาด: ${error}`);
        res.json({ code: 400, msg: `ข้อมูลไม่ถูกต้อง` });
        return;
    }
}