import { Request, Response } from "express";

import getUserIDbyToken from "../../module/getUserIDbyToken";
import getAllPoint from "../utils/getAllPoint";

import { log } from "console";

export default async function getPoint(req:Request, res:Response) {
    try {
        const user_id = await getUserIDbyToken(req);
        if (user_id == null) {
            res.json({ code: 400, msg: `กรุณาเข้าสู่ระบบ` });
            return;
        }

        const getPointData = await getAllPoint(user_id);
        if (getPointData.code !== 200) {
            res.json(getPointData);
            return;
        }
        
        res.json({ code: 200, msg: `ดึงค่าพ้อยสำเร็จ`, point: getPointData.point });
        return;
    } catch (error) {
        log(`เกิดข้อผิดพลาด: ${error}`);
        res.json({ code: 400, msg: `ดึงค่าพ้อยไม่สำเร็จ` });
        return;
    }
}