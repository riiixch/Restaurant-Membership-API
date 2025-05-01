import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import helmet from 'helmet';
import authRouter from './router/auth';
import isLogin from './controller/user/isLogin';
import userRouter from './router/user';

const app = express();

app.use(cors({
    origin: true, // อนุญาตแค่ origin นี้ / IP ที่อนุญาต
    credentials: true, // อนุญาตส่ง Session ไปกลับ อนุญาตให้ส่ง cookie หรือ header ที่มี credential
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // อนุญาตเฉพาะ method เหล่านี้
    allowedHeaders: ['Content-Type', 'Authorization'], // เฉพาะ header ที่อนุญาตให้ถูกส่งมา
    optionsSuccessStatus: 204, // สำหรับ browser บางตัวที่ไม่รองรับ 200 ใน preflight
}));
app.use(helmet({
    contentSecurityPolicy: { // ป้องกัน XSS และ content ไม่พึงประสงค์จากแหล่งภายนอก
        directives: {
            //styleSrc: ["'self'"],
            //fontSrc: ["'self'"],
            defaultSrc: ["'self'"], // โหลด resource ทั้งหมดจากต้นทางเดียวกับเว็บเท่านั้น
            scriptSrc: ["'self'"], // อนุญาตให้โหลด JavaScript จากเว็บเราเท่านั้น
            imgSrc: ["'self'", "data:"], // อนุญาตให้โหลดภาพจากเว็บเราและ data URI
            objectSrc: ["'none'"], // ห้ามโหลด object (เช่น <object>, <embed>) ทุกกรณี
            frameSrc: ["'none'"], // ป้องกันการฝัง iframe จากทุกแหล่ง
            connectSrc: ["'self'"], // อนุญาตให้เชื่อมต่อ API เฉพาะกับเว็บเรา
            baseUri: ["'self'"], // จำกัดการใช้งาน <base> ให้อยู่ภายใต้เว็บเรา
            formAction: ["'self'"], // อนุญาตให้ submit form เฉพาะไปยังต้นทางเดียวกับเว็บ
            upgradeInsecureRequests: [], // บังคับให้เบราว์เซอร์อัปเกรด HTTP → HTTPS
        },
    },
    //frameguard: {
    //    action: 'DENY',
    //},
    hsts: { // บังคับให้ browser ใช้ HTTPS อย่างเดียว
        maxAge: 31536000, // 1 ปี
        includeSubDomains: true, // บังคับ subdomain ให้ใช้ HTTPS ด้วย
        preload: true, // ขอให้ browser preload HSTS นี้ไว้ล่วงหน้า (ต้องส่งให้ Chrome ตรวจสอบก่อน)
    },
    noSniff: true, // ป้องกัน MIME sniffing — ป้องกัน browser เดา content type เอง
    referrerPolicy: {
        policy: 'no-referrer', // ไม่ส่งค่า Referer header ไปยังทุกเว็บ (เพิ่มความเป็นส่วนตัว)
    },
    crossOriginEmbedderPolicy: {
        policy: 'require-corp', // ป้องกันการฝัง resource จาก cross-origin ที่ไม่ระบุ CORS
    },
    crossOriginOpenerPolicy: {
        policy: 'same-origin', // แยก context ของ tab เพื่อป้องกันการเข้าถึงข้าม origin
    },
    crossOriginResourcePolicy: {
        policy: 'same-origin', // ป้องกันไม่ให้ resource ของเว็บนี้ถูกโหลดโดย origin อื่น
    },
    dnsPrefetchControl: {
        allow: false, // ปิดการ prefetch DNS เพื่อไม่ให้ browser ทำการ lookup โดเมนล่วงหน้า
    },
    ieNoOpen: true, // ป้องกันไฟล์แนบเปิดใน iframe/IE — ลดช่องโหว่เปิดไฟล์ใน IE
    permittedCrossDomainPolicies: {
        permittedPolicies: 'none', // ป้องกัน Flash/Adobe อ่าน crossdomain.xml
    },
    originAgentCluster: true, // แยก agent cluster (เพิ่ม isolation สำหรับ Chrome)
    hidePoweredBy: true, // ซ่อน header `X-Powered-By: Express` เพื่อป้องกันข้อมูลรั่ว
    xssFilter: true, // (เลิกใช้แล้วใน Helmet 5+) เคยใช้ตั้ง X-XSS-Protection แต่ปัจจุบัน browser จัดการเอง
}));

app.use(express.json());
app.use(fileUpload());

app.use('/api/auth', authRouter);

app.use('/api/user', isLogin);
app.use('/api/user', userRouter);

export default app;