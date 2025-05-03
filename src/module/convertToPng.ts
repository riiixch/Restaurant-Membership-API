import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

import { log } from "console";

interface ConvertImageOptions {
  imageBuffer: Buffer; // Buffer ของไฟล์ภาพ
  outputPath: string; // Path สำหรับบันทึกไฟล์ .png
  quality?: number; // คุณภาพของ .png (0-100, default: 80)
}

export default async function convertToPng(options: ConvertImageOptions): Promise<{ fileName: string; filePath: string }> {
  const { imageBuffer, outputPath, quality = 80 } = options;

  try {
    if (!Buffer.isBuffer(imageBuffer)) {
      throw new Error('Invalid image buffer');
    }

    const outputDir = path.dirname(outputPath);
    await fs.mkdir(outputDir, { recursive: true });

    const fileName = path.basename(outputPath, path.extname(outputPath)) || `converted_${Date.now()}`;
    const finalFilePath = path.join(outputDir, `${fileName}.png`);

    const pngBuffer = await sharp(imageBuffer)
      .png({ quality })
      .toBuffer();

    await fs.writeFile(finalFilePath, pngBuffer);

    return {
      fileName: `${fileName}.png`,
      filePath: finalFilePath,
    };
  } catch (error) {
    throw new Error(`Failed to convert image to PNG: ${error}`);
  }
}

async function main() {
  try {
    const imageBuffer = await fs.readFile(path.join(__dirname, 'input.jpg'));

    const result = await convertToPng({
      imageBuffer,
      outputPath: path.join(__dirname, 'uploads/output.png'),
      quality: 90,
    });

    log('Image converted successfully:', result);
  } catch (error) {
    log('Error:', error);
  }
}