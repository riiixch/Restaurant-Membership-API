import ValidateInput from "../../module/ValidateInput";
import prismaClient from "../../module/prismaClient";

import { log } from "console";

export default async function getAllPoint(user_id:string) {
    try {
        if (!ValidateInput(user_id, 'text')) {
            return { code: 400, msg: `กรุณากรอก ไอดีผู้ใช้งาน` };
        }

        const prisma = await prismaClient();
        const userData = await prisma.user.findUnique({
            where: {
                user_id: user_id,
            }
        });
        if (!userData) {
            return { code: 400, msg: `ไม่มีบัญชีผู้ใช้งานนี้` };
        }

        const transactionData = await prisma.transaction.findMany({
            where: {
                user_id: user_id,
            }
        });

        const earnedPoint = transactionData.filter(tra => tra.tra_type === 'earned').reduce((a, b) => a + b.tra_point, 0);
        const usedPoint = transactionData.filter(tra => tra.tra_type !== 'earned').reduce((a, b) => a + b.tra_point, 0);
        const currentPoint = Number(earnedPoint - usedPoint);

        return { code: 200, msg: `ดึงพ้อยสำเร็จ`, point: currentPoint };
    } catch (error) {
        log(`เกิดข้อผิดพลาด: ${error}`);
        return { code: 400, msg: `ดึงพ้อยไม่สำเร็จ` };
    }
}