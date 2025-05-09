import { Request, Response } from "express";

import getUserIDbyToken from "../../module/getUserIDbyToken";
import ValidateInput from "../../module/ValidateInput";
import prismaClient from "../../module/prismaClient";
import { RandomID } from "../../module/RandomID";

import getAllPoint from "../utils/getAllPoint";

import { log } from "console";

export default async function useRedeemReward(req: Request, res: Response) {
    try {
        const { rew_id } = req.body;
        const user_id = await getUserIDbyToken(req);

        if (!ValidateInput(rew_id, 'text')) {
            res.json({ code: 400, msg: `กรุณากรอก ไอดีของรางวัล` });
            return;
        } else
        if (user_id == null) {
            res.json({ code: 400, msg: `กรุณาเข้าสู่ระบบ` });
            return;
        }

        const prisma = await prismaClient();
        const userData = await prisma.user.findUnique({
            where: {
                user_id: user_id,
            }
        });
        if (!userData) {
            res.json({ code: 400, msg: `ไม่มีบัญชีผู้ใช้งานนี้` });
            return;
        }

        const rewardData = await prisma.reward.findUnique({
            where: {
                rew_id: rew_id,
            }
        });
        if (!rewardData) {
            res.json({ code: 400, msg: `ไม่มีของรางวัลนี้` });
            return;
        }

        const getPointData = await getAllPoint(user_id);
        if (getPointData.code !== 200) {
            res.json(getPointData);
            return;
        }

        const point = getPointData.point;
        if (!point || point < rewardData.rew_point) {
            res.json({ code: 400, msg: `แต้มของคุณไม่เพียงพอ` });
            return;
        }

        await prisma.transaction.create({
            data: {
                tra_type: 'reward',
                tra_descript: `แลกรางวัล ${rewardData.rew_name}`,
                tra_point: rewardData.rew_point,
                user_id: user_id,
            }
        });

        await prisma.redeemHistory.create({
            data: {
                red_code: RandomID(32),
                red_point: rewardData.rew_point,
                rew_id: rew_id,
                user_id: user_id,
            }
        });

        res.json({ code: 200, msg: `แลกรางวัลสำเร็จ` });
        return;
    } catch (error) {
        log(`เกิดข้อผิดพลาด: ${error}`);
        res.json({ code: 400, msg: `แลกรางวัลไม่สำเร็จ` });
        return;
    }
}