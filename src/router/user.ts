import express from "express"

import checkAdmin from "../controller/permission/checkAdmin";

import getData from "../controller/user_utils/getData";
import getPoint from "../controller/point/getPoint";
import getTransaction from "../controller/point/getTransaction";
import getReward from "../controller/reward/getReward";

import changePassword from "../controller/user_utils/changePassword";

import editProfile from "../controller/user_utils/editProfile";

import getRedeemUser from "../controller/redeem/getRedeemUser";
import redeemReward from "../controller/user_utils/redeemReward";

const userRouter = express.Router();

userRouter.get('/isadmin', checkAdmin);

userRouter.get('/data', getData);
userRouter.get('/point', getPoint);
userRouter.get('/transaction', getTransaction);
userRouter.get('/reward', getReward);

userRouter.post('/changepassword', changePassword);

userRouter.put('/profile', editProfile);

userRouter.get('/redeem', getRedeemUser);
userRouter.post('/redeem', redeemReward);

export default userRouter;