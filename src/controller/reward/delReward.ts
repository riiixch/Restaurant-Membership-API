import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import ValidateInput from "../../module/ValidateInput";

import { log } from "console";

export default async function delReward(req: Request, res: Response) {
    try {
        const { rew_id } = req.body;

        if (!ValidateInput(rew_id, 'text')) {
            res.json({ code: 400, msg: `กรุณากรอก ไอดีของรางวัล` });
            return;
        }

        const prisma = new PrismaClient();
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