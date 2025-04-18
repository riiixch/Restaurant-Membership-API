import { config } from 'dotenv';
config();
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';

import ValidateInput from "../../module/ValidateInput";
import { encodeJWT } from "../../module/JWT";

import { log } from "console";

export default async function authRegister(req:Request, res:Response) {
    try {
        const { username, email, password, confirm_password } = req.body;

        if (!ValidateInput(username, 'text')) {
            res.json({ code: 400, msg: `กรุณากรอก ชื่อผู้ใช้งาน` });
            return;
        } else
        if (!ValidateInput(email, 'email')) {
            res.json({ code: 400, msg: `กรุณากรอก ชื่อผู้ใช้งาน` });
            return;
        } else
        if (!ValidateInput(password, 'text')) {
            res.json({ code: 400, msg: `กรุณากรอก รหัสผ่าน` });
            return;
        } else
        if (!ValidateInput(confirm_password, 'text')) {
            res.json({ code: 400, msg: `กรุณากรอก รหัสผ่าน` });
            return;
        } else
        if (password !== confirm_password) {
            res.json({ code: 400, msg: `กรุณากรอก รหัสผ่านไม่ตรงกัน` });
            return;
        }

        const prisma = new PrismaClient();
        const usernameExiting = await prisma.user.findUnique({
            where: {
                username: username,
            }
        });
        if (usernameExiting) {
            res.json({ code: 400, msg: `ชื่อผู้ใช้งานนี้ถูกใช้งานไปแล้ว` });
            return;
        }
        const emailExiting = await prisma.user.findUnique({
            where: {
                email: email,
            }
        });
        if (emailExiting) {
            res.json({ code: 400, msg: `อีเมลนี้ถูกใช้งานไปแล้ว` });
            return;
        }

        const saltRound = Number(process.env.SALT_ROUND) > 0 ? Number(process.env.SALT_ROUND) : 12;
        const hashPassword = await bcrypt.hash(password, saltRound);

        const newUser = await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: hashPassword,
            }
        });

        const data = {
            user_id: newUser.user_id,
            createAt: newUser.createAt,
        }

        const token = await encodeJWT(data);

        res.json({ code: 200, msg: `สมัครสมาชิกสำเร็จ!`, token: token });
        return;
    } catch (error) {
        log(`เกิดข้อผิดพลาด: ${error}`);
        res.json({ code: 400, msg: `เข้าสู่ระบบไม่สำเร็จ` });
        return;
    }
}