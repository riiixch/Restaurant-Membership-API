import express from "express"

import checkAdmin from "../controller/user/checkAdmin";

import getData from "../controller/user/getData";
import getPoint from "../controller/point/getPoint";
import getTransaction from "../controller/point/getTransaction";
import getReward from "../controller/reward/getReward";

import changePassword from "../controller/user/changePassword";

import editProfile from "../controller/user/editProfile";

const userRouter = express.Router();

userRouter.get('/isadmin', checkAdmin);

userRouter.get('/data', getData);
userRouter.get('/point', getPoint);
userRouter.get('/transaction', getTransaction);
userRouter.get('/reward', getReward);

userRouter.post('/changepassword', changePassword);

userRouter.put('/profile', editProfile);

export default userRouter;