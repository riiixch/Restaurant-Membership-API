import { Request, Response } from "express";

import getUserIDbyToken from "../../module/getUserIDbyToken";
import ValidateInput from "../../module/ValidateInput";
import prismaClient from "../../module/prismaClient";

import { log } from "console";

export default async function getRedeemUser(req:Request, res:Response) {
    try {
        const user_id = await getUserIDbyToken(req);
        if (!ValidateInput(user_id, 'text')) {
            res.json({ code: 400, msg: `กรุณาเข้าสู่ระบบ` });
            return;
        }

        const prisma = await prismaClient();
        const redeemData = await prisma.redeemHistory.findMany({
            where: {
                user_id: user_id,
            },
            include: {
                reward: true,
            }
        });

        res.json({ code: 200, msg: `ดึงรายการแลกรางวัลสำเร็จ`, redeemData: redeemData });
        return;
    } catch (error) {
        log(`เกิดข้อผิดพลาด: ${error}`);
        res.json({ code: 400, msg: `ดึงรายการแลกรางวัลไม่สำเร็จ` });
        return;
    }
}