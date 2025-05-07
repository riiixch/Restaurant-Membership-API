import { Request, Response } from "express";
import bcrypt from 'bcrypt';

import config from "../../module/config";
import ValidateInput from "../../module/ValidateInput";
import prismaClient from "../../module/prismaClient";
import { encodeJWT } from "../../module/JWT";

import { log } from "console";

export default async function authRegister(req:Request, res:Response) {
    try {
        const { username, email, phone, fname, lname, password, confirm_password } = req.body;

        if (!ValidateInput(username, 'text')) {
            res.json({ code: 400, msg: `กรุณากรอก ชื่อผู้ใช้งาน` });
            return;
        } else
        if (!ValidateInput(email, 'email')) {
            res.json({ code: 400, msg: `กรุณากรอก ชื่อผู้ใช้งาน` });
            return;
        } else
        if (!ValidateInput(phone, 'phone')) {
            res.json({ code: 400, msg: `กรุณากรอก เบอร์โทรศัพท์` });
            return;
        } else
        if (!ValidateInput(fname, 'text')) {
            res.json({ code: 400, msg: `กรุณากรอก ชื่อจริง` });
            return;
        } else
        if (!ValidateInput(lname, 'text')) {
            res.json({ code: 400, msg: `กรุณากรอก นามสกุล` });
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
            res.json({ code: 400, msg: `กรุณากรอก รหัสผ่านให้ตรงกัน` });
            return;
        }

        const prisma = await prismaClient();
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
        const phoneExiting = await prisma.user.findUnique({
            where: {
                phone: phone,
            }
        });
        if (phoneExiting) {
            res.json({ code: 400, msg: `เบอรืโทรศัพท์นี้ถูกใช้งานไปแล้ว` });
            return;
        }

        const saltRound = config.SALT_ROUND;
        const hashPassword = await bcrypt.hash(password, saltRound);

        const newUser = await prisma.user.create({
            data: {
                username: username,
                email: email,
                phone: phone,
                fname: fname,
                lname: lname,
                password: hashPassword,
            }
        });

        const data = {
            user_id: newUser.user_id,
            createAt: newUser.createAt,
        }

        const token = await encodeJWT(data);

        res.json({ code: 200, msg: `สมัครสมาชิกสำเร็จ!`, token: token, uesr_id: newUser.user_id });
        return;
    } catch (error) {
        log(`เกิดข้อผิดพลาด: ${error}`);
        res.json({ code: 400, msg: `เข้าสู่ระบบไม่สำเร็จ` });
        return;
    }
}