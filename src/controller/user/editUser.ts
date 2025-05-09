import { Request, Response } from "express";
import fileUpload from "express-fileupload";
import bcrypt from 'bcrypt';
import path from "path";

import config from "../../module/config";
import ValidateInput from "../../module/ValidateInput";
import prismaClient from "../../module/prismaClient";
import imageUserPath from "../../module/imageUserPath";
import { convertToPng } from "../../module/convertToPng";

import { log } from "console";

export default async function editUser(req:Request, res:Response) {
    try {
            const { user_id, username, email, phone, fname, lname, password } = req.body;
    
            if (!ValidateInput(user_id, 'text')) {
                res.json({ code: 400, msg: `กรุณากรอก ไอดีผู้ใช้งาน` });
                return;
            } else
            if (!ValidateInput(username, 'text')) {
                res.json({ code: 400, msg: `กรุณากรอก ชื่อผู้ใช้งาน` });
                return;
            } else
            if (!ValidateInput(email, 'email')) {
                res.json({ code: 400, msg: `กรุณากรอก อีเมล` });
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
            const usernameExiting = await prisma.user.findUnique({
                where: {
                    username: username,
                }
            });
            if (usernameExiting && usernameExiting.user_id !== user_id) {
                res.json({ code: 400, msg: `ชื่อผู้ใช้งานนี้ถูกใช้งานไปแล้ว` });
                return;
            }
            const emailExiting = await prisma.user.findUnique({
                where: {
                    email: email,
                }
            });
            if (emailExiting && emailExiting.user_id !== user_id) {
                res.json({ code: 400, msg: `อีเมลนี้ถูกใช้งานไปแล้ว` });
                return;
            }
            const phoneExiting = await prisma.user.findUnique({
                where: {
                    phone: phone,
                }
            });
            if (phoneExiting && phoneExiting.user_id !== user_id) {
                res.json({ code: 400, msg: `เบอรืโทรศัพท์นี้ถูกใช้งานไปแล้ว` });
                return;
            }
            
            await prisma.user.update({
                where: {
                    user_id: user_id,
                },
                data: {
                    username: username,
                    email: email,
                    phone: phone,
                    fname: fname,
                    lname: lname,
                }
            });

            if (password != null) {
                const saltRound = config.SALT_ROUND;
                const hashPassword = await bcrypt.hash(password, saltRound);
        
                await prisma.user.update({
                    where: {
                        user_id: user_id,
                    },
                    data: {
                        password: hashPassword,
                    }
                });
            }
            
            if (req.files && req.files.image) {
                const image = req.files.image as fileUpload.UploadedFile;
                const imageData = await convertToPng({
                    imageBuffer: image.data,
                    outputPath: path.join(imageUserPath, user_id),
                    quality: 80,
                });
                await prisma.user.update({
                    where: {
                        user_id: user_id,
                    },
                    data: {
                        profile: imageData.fileName,
                    }
                });
            }
    
            res.json({ code: 200, msg: `แกไขสมาชิกสำเร็จ` });
            return;
    } catch (error) {
        log(`เกิดข้อผิดพลาด: ${error}`);
        res.json({ code: 400, msg: `แกไขสมาชิกไม่สำเร็จ` });
        return;
    }
}