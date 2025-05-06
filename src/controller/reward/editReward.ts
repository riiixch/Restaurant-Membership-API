import { Request, Response } from "express";
import fileUpload from "express-fileupload";
import { PrismaClient } from "@prisma/client";
import path from "path";

import ValidateInput from "../../module/ValidateInput";
import imageRewardPath from "../../module/imageRewardPath";
import convertToPng from "../../module/convertToPng";

import { log } from "console";

export default async function editReward(req: Request, res: Response) {
    try {
        const { rew_id, rew_name, rew_point, rew_descript, rew_img } = req.body;

        const _rew_img = String(rew_img).split(' ');
        let file_name;
        let i = 0;
        do {
            i = i + 1;
            file_name = rew_id + '_' + i;
        } while (_rew_img.includes(file_name + '.png'));

        log(req.body);
        log(file_name);

        if (!ValidateInput(rew_id, 'text')) {
            res.json({ code: 400, msg: `กรุณากรอก ไอดีของรางวัล` });
            return;
        }
        if (!ValidateInput(rew_name, 'text')) {
            res.json({ code: 400, msg: `กรุณากรอก ชื่อของรางวัล` });
            return;
        }
        if (!ValidateInput(rew_point, 'number')) {
            res.json({ code: 400, msg: `กรุณากรอก จำนวนพ้อยที่ใช้แลก` });
            return;
        }
        if (!ValidateInput(rew_descript, 'text')) {
            res.json({ code: 400, msg: `กรุณากรอก รายละเอียด` });
            return;
        }
        if (!req.files && _rew_img.length < 1) {
            res.json({ code: 400, msg: `กรุณากรอก รูปภาพ` });
            return;
        }

        const prisma = new PrismaClient();
        const rewardData = await prisma.reward.findUnique({
            where: {
                rew_id: rew_id,
            }
        });
        if (!rewardData || rewardData == null) {
            res.json({ code: 400, msg: `ไม่พบของรางวัลในระบบ` });
            return;
        }
        await prisma.reward.update({
            where: {
                rew_id: rew_id,
            },
            data: {
                rew_name: rew_name,
                rew_descript: rew_descript,
                rew_point: Number(rew_point),
                rew_img: _rew_img,
            }
        });

        if (req.files && req.files.image_1) {
            const image = req.files.image_1 as fileUpload.UploadedFile;
            const rewardData = await prisma.reward.findUnique({
                where: {
                    rew_id: rew_id,
                }
            });
            if (!rewardData) {
                res.json({ code: 400, msg: `ไม่พบของรางวัลในระบบ` });
                return;
            }
            let file_name;
            let i = 0;
            do {
                i = i + 1;
                file_name = rew_id + '_' + i;
            } while (_rew_img.includes(file_name + '.png'));
            const imageData = await convertToPng({
                imageBuffer: image.data,
                outputPath: path.join(imageRewardPath, file_name),
                quality: 80,
            });
            rewardData.rew_img.push(imageData.fileName);
            await prisma.reward.update({
                where: {
                    rew_id: rew_id,
                },
                data: {
                    rew_img: rewardData.rew_img,
                }
            });
        }

        if (req.files && req.files.image_2) {
            const image = req.files.image_2 as fileUpload.UploadedFile;
            const rewardData = await prisma.reward.findUnique({
                where: {
                    rew_id: rew_id,
                }
            });
            if (!rewardData) {
                res.json({ code: 400, msg: `ไม่พบของรางวัลในระบบ` });
                return;
            }
            let file_name;
            let i = 0;
            do {
                i = i + 1;
                file_name = rew_id + '_' + i;
            } while (_rew_img.includes(file_name + '.png'));
            const imageData = await convertToPng({
                imageBuffer: image.data,
                outputPath: path.join(imageRewardPath, file_name),
                quality: 80,
            });
            rewardData.rew_img.push(imageData.fileName);
            await prisma.reward.update({
                where: {
                    rew_id: rew_id,
                },
                data: {
                    rew_img: rewardData.rew_img,
                }
            });
        }

        if (req.files && req.files.image_3) {
            const image = req.files.image_3 as fileUpload.UploadedFile;
            const rewardData = await prisma.reward.findUnique({
                where: {
                    rew_id: rew_id,
                }
            });
            if (!rewardData) {
                res.json({ code: 400, msg: `ไม่พบของรางวัลในระบบ` });
                return;
            }
            let file_name;
            let i = 0;
            do {
                i = i + 1;
                file_name = rew_id + '_' + i;
            } while (_rew_img.includes(file_name + '.png'));
            const imageData = await convertToPng({
                imageBuffer: image.data,
                outputPath: path.join(imageRewardPath, file_name),
                quality: 80,
            });
            rewardData.rew_img.push(imageData.fileName);
            await prisma.reward.update({
                where: {
                    rew_id: rew_id,
                },
                data: {
                    rew_img: rewardData.rew_img,
                }
            });
        }

        if (req.files && req.files.image_4) {
            const image = req.files.image_4 as fileUpload.UploadedFile;
            const rewardData = await prisma.reward.findUnique({
                where: {
                    rew_id: rew_id,
                }
            });
            if (!rewardData) {
                res.json({ code: 400, msg: `ไม่พบของรางวัลในระบบ` });
                return;
            }
            let file_name;
            let i = 0;
            do {
                i = i + 1;
                file_name = rew_id + '_' + i;
            } while (_rew_img.includes(file_name + '.png'));
            const imageData = await convertToPng({
                imageBuffer: image.data,
                outputPath: path.join(imageRewardPath, file_name),
                quality: 80,
            });
            rewardData.rew_img.push(imageData.fileName);
            await prisma.reward.update({
                where: {
                    rew_id: rew_id,
                },
                data: {
                    rew_img: rewardData.rew_img,
                }
            });
        }

        if (req.files && req.files.image_5) {
            const image = req.files.image_5 as fileUpload.UploadedFile;
            const rewardData = await prisma.reward.findUnique({
                where: {
                    rew_id: rew_id,
                }
            });
            if (!rewardData) {
                res.json({ code: 400, msg: `ไม่พบของรางวัลในระบบ` });
                return;
            }
            let file_name;
            let i = 0;
            do {
                i = i + 1;
                file_name = rew_id + '_' + i;
            } while (_rew_img.includes(file_name + '.png'));
            const imageData = await convertToPng({
                imageBuffer: image.data,
                outputPath: path.join(imageRewardPath, file_name),
                quality: 80,
            });
            rewardData.rew_img.push(imageData.fileName);
            await prisma.reward.update({
                where: {
                    rew_id: rew_id,
                },
                data: {
                    rew_img: rewardData.rew_img,
                }
            });
        }
        
        res.json({ code: 200, msg: `แก้ไขของรางวัลสำเร็จ` });
        return;
    } catch (error) {
        log(`เกิดข้อผิดพลาด: ${error}`);
        res.json({ code: 400, msg: `แก้ไขของรางวัลไม่สำเร็จ` });
        return;
    }
}