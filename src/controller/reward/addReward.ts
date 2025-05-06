import { Request, Response } from "express";
import fileUpload from "express-fileupload";
import { PrismaClient } from "@prisma/client";
import path from "path";

import ValidateInput from "../../module/ValidateInput";
import imageRewardPath from "../../module/imageRewardPath";
import convertToPng from "../../module/convertToPng";

import { log } from "console";

export default async function addReward(req: Request, res: Response) {
    try {
        const { rew_name, rew_point, rew_descript } = req.body;

        if (!ValidateInput(rew_name, 'text')) {
            res.json({ code: 400, msg: `กรุณากรอก ชื่อของรางวัล` });
            return;
        } else
        if (!ValidateInput(rew_point, 'number')) {
            res.json({ code: 400, msg: `กรุณากรอก จำนวนพ้อยที่ใช้แลก` });
            return;
        } else
        if (!ValidateInput(rew_descript, 'text')) {
            res.json({ code: 400, msg: `กรุณากรอก รายละเอียด` });
            return;
        } else
        if (!req.files || !req.files.image_1) {
            res.json({ code: 400, msg: `กรุณากรอก ใส่รูปภาพมาอย่างน้อย 1 รูปภาพ` });
            return;
        }

        const prisma = new PrismaClient();
        const newReward = await prisma.reward.create({
            data: {
                rew_name: rew_name,
                rew_descript: rew_descript,
                rew_point: Number(rew_point),
            }
        });

        if (req.files && req.files.image_1) {
            const image = req.files.image_1 as fileUpload.UploadedFile;
            const imageData = await convertToPng({
                imageBuffer: image.data,
                outputPath: path.join(imageRewardPath, newReward.rew_id + '_1'),
                quality: 80,
            });
            const rewardData = await prisma.reward.findUnique({
                where: {
                    rew_id: newReward.rew_id,
                }
            });
            if (!rewardData) {
                return;
            }
            rewardData.rew_img.push(imageData.fileName);
            await prisma.reward.update({
                where: {
                    rew_id: newReward.rew_id,
                },
                data: {
                    rew_img: rewardData.rew_img,
                }
            });
        }

        if (req.files && req.files.image_2) {
            const image = req.files.image_2 as fileUpload.UploadedFile;
            const imageData = await convertToPng({
                imageBuffer: image.data,
                outputPath: path.join(imageRewardPath, newReward.rew_id + '_2'),
                quality: 80,
            });
            const rewardData = await prisma.reward.findUnique({
                where: {
                    rew_id: newReward.rew_id,
                }
            });
            if (!rewardData) {
                return;
            }
            rewardData.rew_img.push(imageData.fileName);
            await prisma.reward.update({
                where: {
                    rew_id: newReward.rew_id,
                },
                data: {
                    rew_img: rewardData.rew_img,
                }
            });
        }

        if (req.files && req.files.image_3) {
            const image = req.files.image_3 as fileUpload.UploadedFile;
            const imageData = await convertToPng({
                imageBuffer: image.data,
                outputPath: path.join(imageRewardPath, newReward.rew_id + '_3'),
                quality: 80,
            });
            const rewardData = await prisma.reward.findUnique({
                where: {
                    rew_id: newReward.rew_id,
                }
            });
            if (!rewardData) {
                return;
            }
            rewardData.rew_img.push(imageData.fileName);
            await prisma.reward.update({
                where: {
                    rew_id: newReward.rew_id,
                },
                data: {
                    rew_img: rewardData.rew_img,
                }
            });
        }

        if (req.files && req.files.image_4) {
            const image = req.files.image_4 as fileUpload.UploadedFile;
            const imageData = await convertToPng({
                imageBuffer: image.data,
                outputPath: path.join(imageRewardPath, newReward.rew_id + '_4'),
                quality: 80,
            });
            const rewardData = await prisma.reward.findUnique({
                where: {
                    rew_id: newReward.rew_id,
                }
            });
            if (!rewardData) {
                return;
            }
            rewardData.rew_img.push(imageData.fileName);
            await prisma.reward.update({
                where: {
                    rew_id: newReward.rew_id,
                },
                data: {
                    rew_img: rewardData.rew_img,
                }
            });
        }

        if (req.files && req.files.image_5) {
            const image = req.files.image_5 as fileUpload.UploadedFile;
            const imageData = await convertToPng({
                imageBuffer: image.data,
                outputPath: path.join(imageRewardPath, newReward.rew_id + '_5'),
                quality: 80,
            });
            const rewardData = await prisma.reward.findUnique({
                where: {
                    rew_id: newReward.rew_id,
                }
            });
            if (!rewardData) {
                return;
            }
            rewardData.rew_img.push(imageData.fileName);
            await prisma.reward.update({
                where: {
                    rew_id: newReward.rew_id,
                },
                data: {
                    rew_img: rewardData.rew_img,
                }
            });
        }

        res.json({ code: 200, msg: `เพิ่มของรางวัลสำเร็จ` });
        return;
    } catch (error) {
        log(`เกิดข้อผิดพลาด: ${error}`);
        res.json({ code: 400, msg: `เพิ่มของรางวัลไม่สำเร็จ` });
        return;
    }
}