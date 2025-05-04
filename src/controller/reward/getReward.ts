import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import { log } from "console";

export default async function getReward(req:Request, res:Response) {
    try {
        const prisma = new PrismaClient();
        const rewardData = await prisma.reward.findMany();

        res.json({ code: 400, msg: `ดึงข้อมูลของรางวัลสำเร็จ`, rewardData: rewardData });
        return;
    } catch (error) {
        log(`เกิดข้อผิดพลาด: ${error}`);
        res.json({ code: 400, msg: `ดึงข้อมูลของรางวัลไม่สำเร็จ` });
        return;
    }
}