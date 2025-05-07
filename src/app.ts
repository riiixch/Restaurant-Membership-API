import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';

import isLogin from './controller/permission/isLogin';
import isAdmin from './controller/permission/isAdmin';

import authRouter from './router/auth';
import userRouter from './router/user';
import adminRouter from './router/admin';

import imageUserPath from './module/imageUserPath';
import imageRewardPath from './module/imageRewardPath';

const app = express();

app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
}));
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:"],
            objectSrc: ["'none'"],
            frameSrc: ["'none'"],
            connectSrc: ["'self'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            upgradeInsecureRequests: [],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
    noSniff: true,
    referrerPolicy: {
        policy: 'no-referrer',
    },
    crossOriginEmbedderPolicy: {
        policy: 'require-corp',
    },
    crossOriginOpenerPolicy: {
        policy: 'same-origin',
    },
    crossOriginResourcePolicy: {
        policy: 'same-origin',
    },
    dnsPrefetchControl: {
        allow: false,
    },
    ieNoOpen: true,
    permittedCrossDomainPolicies: {
        permittedPolicies: 'none',
    },
    originAgentCluster: true,
    hidePoweredBy: true,
    xssFilter: true,
}));

app.use(fileUpload());
app.use(express.json());

app.use('/api/auth', authRouter);

app.use('/api/user', isLogin);
app.use('/api/user', userRouter);

app.use('/api/admin', isAdmin);
app.use('/api/admin', adminRouter);

app.use('/image/user', express.static(path.join(imageUserPath)));
app.use('/image/reward', express.static(path.join(imageRewardPath)));

export default app;