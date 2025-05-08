import express from "express";
import addPoint from "../controller/transaction/addPoint";
import getUser from "../controller/user/getUser";
import addUser from "../controller/user/addUser";
import editUser from "../controller/user/editUser";
import delUser from "../controller/user/delUser";
import getReward from "../controller/reward/getReward";
import addReward from "../controller/reward/addReward";
import editReward from "../controller/reward/editReward";
import delReward from "../controller/reward/delReward";

const adminRouter = express.Router();

adminRouter.post('/transaction', addPoint);

adminRouter.get('/user', getUser);
adminRouter.post('/user', addUser);
adminRouter.put('/user', editUser);
adminRouter.delete('/user', delUser);

adminRouter.get('/reward', getReward);
adminRouter.post('/reward', addReward);
adminRouter.put('/reward', editReward);
adminRouter.delete('/reward', delReward);

export default adminRouter;