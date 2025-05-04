import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import ValidateInput from "../../module/ValidateInput";

import { log } from "console";

export default async function delReward(req:Request, res:Response) {
    try {
        const { rew_id } = req.body;
        
    } catch (error) {
        log(`เกิดข้อผิดพลาด: ${error}`);
        res.json({ code: 400, msg: `ลบของรางวัลไม่สำเร็จ` });
        return;
    }
}