import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';

import ValidateInput from "../../module/ValidateInput";
import { encodeJWT } from "../../module/JWT";

import { log } from "console";

export default async function authLogin(req:Request, res:Response) {
    try {
        const { username, password } = req.body;

        if (!ValidateInput(username, 'text')) {
            res.json({ code: 400, msg: `กรุณากรอก ชื่อผู้ใช้งาน` });
            return;
        } else
        if (!ValidateInput(password, 'text')) {
            res.json({ code: 400, msg: `กรุณากรอก รหัสผ่าน` });
            return;
        }

        const prisma = new PrismaClient()
        const user = await prisma.user.findUnique({
            where: {
                username: username,
            }
        });
        if (!user) {
            res.json({ code: 400, msg: `ไม่มีข้อมูล ชื่อผู้ใช้งาน` });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.json({ code: 400, msg: `รหัสผ่านไม่ถูกต้อง` });
            return;
        }

        const data = {
            user_id: user.user_id,
            createAt: user.createAt,
        }

        const token = await encodeJWT(data);

        res.json({ code: 200, msg: `เข้าสู่ระบบสำเร็จ!`, token: token });
        return;
    } catch (error) {
        log(`เกิดข้อผิดพลาด: ${error}`);
        res.json({ code: 400, msg: `เข้าสู่ระบบไม่สำเร็จ` });
        return;
    }
}