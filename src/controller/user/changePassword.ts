import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';

import ValidateInput from "../../module/ValidateInput";
import getUserIDbyToken from "../../module/getUserIDbyToken";

import { log } from "console";
import config from "../../module/config";

export default async function changePassword(req: Request, res: Response) {
    try {
        const { old_password, new_password, confirm_new_password } = req.body;

        if (!ValidateInput(old_password, 'text')) {
            res.json({ code: 400, msg: `กรุณากรอก รหัสผ่านเดิม` });
            return;
        } else
        if (!ValidateInput(new_password, 'text')) {
            res.json({ code: 400, msg: `กรุณากรอก รหัสใหม่` });
            return;
        } else
        if (!ValidateInput(confirm_new_password, 'text')) {
            res.json({ code: 400, msg: `กรุณากรอก ยืนยันรหัสใหม่` });
            return;
        } else
        if (new_password !== confirm_new_password) {
            res.json({ code: 400, msg: `กรุณากรอก รหัสใหม่ กับยืนยันรหัสใหม่ ไม่ตรงกัน` });
            return;
        }

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

        const isMatch = await bcrypt.compare(old_password, userData.password);
        if (!isMatch) {
            res.json({ code: 400, msg: `รหัสผ่านไม่ถูกต้อง` });
            return;
        }

        const hashPassword = await bcrypt.hash(new_password, config.SALT_ROUND);
        await prisma.user.update({
            where: {
                user_id: user_id,
            },
            data: {
                password: hashPassword,
            }
        });

        res.json({ code: 200, msg: `เปลี่ยนรหัสผ่านสำเร็จ` });
        return;
    } catch (error) {
        log(`เกิดข้อผิดพลาด: ${error}`);
        res.json({ code: 400, msg: `เปลี่ยนรหัสผ่านไม่สำเร็จ` });
        return;
    }
}