import { Request, Response } from "express";

import prismaClient from "../../module/prismaClient";

import { log } from "console";

export default async function getRedeem(req:Request, res:Response) {
    try {
        const prisma = await prismaClient();
        const redeemData = await prisma.redeemHistory.findMany();
        
        res.json({ code: 200, msg: `ดึงรายการแลกรางวัลสำเร็จ`, redeem: redeemData });
        return;
    } catch (error) {
        log(`เกิดข้อผิดพลาด: ${error}`);
        res.json({ code: 400, msg: `ดึงรายการแลกรางวัลไม่สำเร็จ` });
        return;
    }
}