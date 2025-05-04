import { Request, Response } from "express";
import fileUpload from "express-fileupload";
import { PrismaClient } from "@prisma/client";
import path from "path";

import ValidateInput from "../../module/ValidateInput";

import { log } from "console";

export default async function editReward(req:Request, res:Response) {
    try {
        const { rew_id, rew_name, rew_cost, rew_descript } = req.body;
        
    } catch (error) {
        log(`เกิดข้อผิดพลาด: ${error}`);
        res.json({ code: 400, msg: `แก้ไขของรางวัลไม่สำเร็จ` });
        return;
    }
}