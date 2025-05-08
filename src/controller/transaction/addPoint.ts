import { Request, Response } from "express";

import ValidateInput from "../../module/ValidateInput";
import prismaClient from "../../module/prismaClient";

import { log } from "console";

export default async function addPoint(req: Request, res: Response) {
    try {
        const { user_id, point } = req.body;

        if (!ValidateInput(user_id, 'text')) {
            res.json({ code: 400, msg: `กรุณากรอก ไอดีผู้ใช้งาน` });
            return;
        } else
        if (!ValidateInput(point, 'number')) {
            res.json({ code: 400, msg: `กรุณากรอก จำนวนพ้อย` });
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

        await prisma.transaction.create({
            data: {
                user_id: userData.user_id,
                tra_point: point,
                tra_type: 'earned',
                tra_descript: `รับพ้อยจากแอดมิน`,
            }
        });
        
        res.json({ code: 200, msg: `เพิ่มพ้อยสำเร็จ ${point} พ้อย` });
        return;
    } catch (error) {
        log(`เกิดข้อผิดพลาด: ${error}`);
        res.json({ code: 400, msg: `เพิ่มพ้อยไม่สำเร็จ` });
        return;
    }
}