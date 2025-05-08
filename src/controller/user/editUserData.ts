import { Request, Response } from "express";
import fileUpload from "express-fileupload";
import path from "path";

import imageUserPath from "../../module/imageUserPath";
import getUserIDbyToken from "../../module/getUserIDbyToken";
import prismaClient from "../../module/prismaClient";
import convertToPng from "../../module/convertToPng";

import { log } from "console";

export default async function editUserData(req:Request, res:Response) {
    try {
        const user_id = await getUserIDbyToken(req);
        if (user_id == null) {
            res.json({ code: 400, msg: `กรุณาเข้าสู่ระบบ` });
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

        const { fname, lname } = req.body;
        await prisma.user.update({
            where: {
                user_id: user_id,
            },
            data: {
                fname: fname,
                lname: lname,
            }
        });

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

        const userRes = await prisma.user.findUnique({
            where: {
                user_id: user_id,
            }
        });

        res.json({ code: 200, msg: `อัพเดทโปรไฟล์สำเร็จ`, user: userRes });
        return;
    } catch (error) {
        log(`เกิดข้อผิดพลาด: ${error}`);
        res.json({ code: 400, msg: `อัพเดทโปรไฟล์ไม่สำเร็จ` });
        return;
    }
}