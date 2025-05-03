import express from "express"
import getData from "../controller/user/getData";
import checkAdmin from "../controller/user/checkAdmin";
import getPoint from "../controller/point/getPoint";

const userRouter = express.Router();

userRouter.get('/data', getData);
userRouter.get('/isadmin', checkAdmin);
userRouter.get('/point', getPoint);
userRouter.get('/transaction', getPoint);

export default userRouter;