import express from "express";
import addPoint from "../controller/point/addPoint";
import getUser from "../controller/user/getUser";
import addUser from "../controller/user/addUser";
import editUser from "../controller/user/editUser";
import delUser from "../controller/user/delUser";

const adminRouter = express.Router();

adminRouter.post('/point', addPoint);

adminRouter.get('/user', getUser);
adminRouter.post('/user', addUser);
adminRouter.put('/user', editUser);
adminRouter.delete('/user', delUser);

export default adminRouter;