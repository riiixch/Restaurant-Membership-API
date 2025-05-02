import { Request } from "express";

import ValidateInput from "./ValidateInput";
import { decodeJWT } from "./JWT";

import { log } from "console";

export default async function getUserIDbyToken(req: Request) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token || !ValidateInput(token, 'text')) {
            return null;
        }

        const data = await decodeJWT(token);

        return data.user_id;
    } catch (error) {
        log(`เกิดข้อผิดพลาด: ${error}`);
        return null;
    }
}