import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { log } from 'console';

interface ConvertImageOptions {
  imageBuffer: Buffer; // Buffer ของไฟล์ภาพ
  outputPath: string; // Path สำหรับบันทึกไฟล์ .png
  quality?: number; // คุณภาพของ .png (0-100, default: 80)
}

export async function convertToPng(options: ConvertImageOptions): Promise<{ fileName: string; filePath: string }> {
  const { imageBuffer, outputPath, quality = 80 } = options;

  try {
    // ตรวจสอบว่า imageBuffer เป็น Buffer และไม่ว่าง
    if (!Buffer.isBuffer(imageBuffer) || imageBuffer.length === 0) {
      throw new Error('Invalid or empty image buffer');
    }

    // ตรวจสอบว่า sharp รองรับ input format
    const metadata = await sharp(imageBuffer).metadata();
    if (!metadata.format) {
      throw new Error('Unsupported image format');
    }

    // สร้าง output directory ถ้ายังไม่มี
    const outputDir = path.dirname(outputPath);
    await fs.mkdir(outputDir, { recursive: true });

    // สร้างชื่อไฟล์ (ถ้า outputPath ไม่มีชื่อไฟล์ที่ชัดเจน)
    const fileName = path.basename(outputPath, path.extname(outputPath)) || `converted_${Date.now()}`;
    const finalFilePath = path.join(outputDir, `${fileName}.png`);

    // แปลงภาพเป็น PNG ด้วย sharp
    const pngBuffer = await sharp(imageBuffer)
      .png({ quality: Math.max(0, Math.min(100, quality)) }) // จำกัด quality ระหว่าง 0-100
      .toBuffer();

    // บันทึกไฟล์
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
    // ตรวจสอบว่าไฟล์ input มีอยู่จริง
    const inputPath = path.join(__dirname, 'input.jpg');
    await fs.access(inputPath); // จะ throw error ถ้าไฟล์ไม่มี

    const imageBuffer = await fs.readFile(inputPath);

    const result = await convertToPng({
      imageBuffer,
      outputPath: path.join(__dirname, 'Uploads/output.png'),
      quality: 90,
    });

    log('Image converted successfully:', result);
  } catch (error) {
    log('Error:', error);
  }
}