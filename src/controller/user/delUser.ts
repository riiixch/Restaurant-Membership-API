import { Request, Response } from "express";

import ValidateInput from "../../module/ValidateInput";
import prismaClient from "../../module/prismaClient";

import { log } from "console";

export default async function delUser(req: Request, res: Response) {
    try {
        const { user_id } = req.body;

        if (!ValidateInput(user_id, 'text')) {
            res.json({ code: 400, msg: `กรุณากรอก ไอดีผู้ใช้งาน` });
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

        await prisma.user.delete({
            where: {
                user_id: user_id,
            }
        });
    
        res.json({ code: 200, msg: `ลบสมาชิกสำเร็จ` });
        return;
    } catch (error) {
        log(`เกิดข้อผิดพลาด: ${error}`);
        res.json({ code: 200, msg: `ลบสมาชิกไม่สำเร็จ` });
        return;
    }
}