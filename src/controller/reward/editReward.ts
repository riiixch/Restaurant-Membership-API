import { Request, Response } from "express";
import fileUpload, { FileArray } from "express-fileupload";
import path from "path";

import ValidateInput from "../../module/ValidateInput";
import prismaClient from "../../module/prismaClient";
import imageRewardPath from "../../module/imageRewardPath";
import { convertToPng } from "../../module/convertToPng";

import { log } from "console";

export default async function editReward(req: Request, res: Response) {
    try {
        const { rew_id, rew_name, rew_point, rew_descript, rew_img } = req.body;

        let _rew_img = String(rew_img).split(' ');
        if (_rew_img[0] === '') {
            _rew_img = [];
        }

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
            res.json({ code: 400, msg: `กรุณาเลือก รูปภาพ` });
            return;
        }

        const prisma = await prismaClient();
        const rewardData = await prisma.reward.findUnique({
            where: {
                rew_id: rew_id,
            }
        });
        if (!rewardData || rewardData == null) {
            res.json({ code: 400, msg: `ไม่พบของรางวัลในระบบ` });
            return;
        }

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
                        file_name = rew_id + '_' + i;
                    } while (_rew_img.includes(file_name + '.png'));
                    const imageData = await convertToPng({
                        imageBuffer: fileImage.data,
                        outputPath: path.join(imageRewardPath, file_name),
                        quality: 80,
                    });
                    _rew_img.push(imageData.fileName);
                }
            }
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
        
        res.json({ code: 200, msg: `แก้ไขของรางวัลสำเร็จ` });
        return;
    } catch (error) {
        log(`เกิดข้อผิดพลาด: ${error}`);
        res.json({ code: 400, msg: `แก้ไขของรางวัลไม่สำเร็จ` });
        return;
    }
}