import express from "express"

import checkAdmin from "../controller/permission/checkAdmin";

import getUserData from "../controller/user/getUserData";
import editUserData from "../controller/user/editUserData";

import changePasswordUserData from "../controller/user/changePasswordUserData";

import getPoint from "../controller/transaction/getPoint";
import getTransaction from "../controller/transaction/getTransaction";
import getReward from "../controller/reward/getReward";

import getRedeemUser from "../controller/redeem/getRedeemUser";
import useRedeemReward from "../controller/redeem/useRedeemReward";

const userRouter = express.Router();

userRouter.get('/isadmin', checkAdmin);

userRouter.get('/user', getUserData);
userRouter.put('/user', editUserData);

userRouter.post('/changepassword', changePasswordUserData);

userRouter.get('/point', getPoint);
userRouter.get('/transaction', getTransaction);
userRouter.get('/reward', getReward);

userRouter.get('/redeem', getRedeemUser);
userRouter.post('/redeem', useRedeemReward);

export default userRouter;