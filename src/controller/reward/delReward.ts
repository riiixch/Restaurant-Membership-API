import { Request, Response } from "express";

import ValidateInput from "../../module/ValidateInput";
import prismaClient from "../../module/prismaClient";

import { log } from "console";

export default async function delReward(req: Request, res: Response) {
    try {
        const { rew_id } = req.body;

        if (!ValidateInput(rew_id, 'text')) {
            res.json({ code: 400, msg: `กรุณากรอก ไอดีของรางวัล` });
            return;
        }

        const prisma = await prismaClient();
        await prisma.reward.delete({
            where: {
                rew_id: rew_id,
            }
        });
        
        res.json({ code: 200, msg: `ลบของรางวัลสำเร็จ` });
        return;
    } catch (error) {
        log(`เกิดข้อผิดพลาด: ${error}`);
        res.json({ code: 400, msg: `ลบของรางวัลไม่สำเร็จ` });
        return;
    }
}