import { Request, Response } from "express";
import fileUpload from "express-fileupload";
import path from "path";

import ValidateInput from "../../module/ValidateInput";
import prismaClient from "../../module/prismaClient";
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
            res.json({ code: 400, msg: `กรุณาเลือก รูปภาพอย่างน้อย 1 รูปภาพ` });
            return;
        }

        const prisma = await prismaClient();
        const newReward = await prisma.reward.create({
            data: {
                rew_name: rew_name,
                rew_descript: rew_descript,
                rew_point: Number(rew_point),
            }
        });

        let rew_img:string[] = [];
        
        if (req.files) {
            const files = req.files;
            const pathImages = [ 'image_1', 'image_2', 'image_3', 'image_4', 'image_5' ];
            for (const imgKey of pathImages) {
                if (files[imgKey]) {
                    const fileImage = files[imgKey] as fileUpload.UploadedFile;
                    let file_name;
                    let i = 0;
                    do {
                        i = i + 1;
                        file_name = newReward.rew_id + '_' + i;
                    } while (rew_img.includes(file_name + '.png'));
                    const imageData = await convertToPng({
                        imageBuffer: fileImage.data,
                        outputPath: path.join(imageRewardPath, file_name),
                        quality: 80,
                    });
                    rew_img.push(imageData.fileName);
                }
            }
        }

        if (rew_img && rew_img.length > 0) {
            await prisma.reward.update({
                where: {
                    rew_id: newReward.rew_id,
                },
                data: {
                    rew_img: rew_img,
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