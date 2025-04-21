import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client";

import ValidateInput from "../../module/ValidateInput";
import { decodeJWT } from "../../module/JWT";

import { log } from "console";
import { RandomNumber } from "../../module/RandomNumber";

export default async function getCard(req: Request, res:Response) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token || !ValidateInput(token, 'text')) {
            res.json({ code: 400, msg: `กรุณาเข้าสู่ระบบ` });
            return;
        }

        const data = await decodeJWT(token);
        const user_id = data.user_id;

        const prisma = new PrismaClient();
        const userData = await prisma.user.findUnique({
            where: {
                user_id: user_id,
            },
            include: {
                card: true,
            }
        });
        if (!userData) {
            res.json({ code: 400, msg: `ไม่มีบัญชีผู้ใช้งานนี้` });
            return;
        }

        if (userData.card != null) {
            res.json({ code: 400, msg: `บัญชีผู้ใช้งานนี้มีการ์ดแล้ว` });
            return;
        }

        const cardData = await prisma.card.create({
            data: {
                car_number: RandomNumber(16),
            }
        });

        await prisma.user.update({
            where: {
                user_id: userData.user_id,
            },
            data: {
                car_id: cardData.car_id,
            }
        });

        res.json({ code: 200, msg: `สมัครการ์ดสำเร็จ` });
        return;
    } catch (error) {
        log(`เกิดข้อผิดพลาด: ${error}`);
        res.json({ code: 400, msg: `ข้อมูลไม่ถูกต้อง` });
        return;
    }
}