import { Request, Response } from "express";
import fileUpload from "express-fileupload";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import path from "path";

import config from "../../module/config";
import ValidateInput from "../../module/ValidateInput";
import imageUserPath from "../../module/imageUserPath";
import convertToPng from "../../module/convertToPng";

import { log } from "console";

export default async function delUser(req: Request, res: Response) {
    try {
        const { user_id } = req.body;

        if (!ValidateInput(user_id, 'text')) {
            res.json({ code: 400, msg: `กรุณากรอก ไอดีผู้ใช้งาน` });
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