import { Request, Response } from "express";

import { log } from "console";

export default async function editRedeem(req:Request, res:Response) {
    try {
        
    } catch (error) {
        log(`เกิดข้อผิดพลาด: ${error}`);
        res.json({ code: 400, msg: `ไม่สำเร็จ` });
        return;
    }
}