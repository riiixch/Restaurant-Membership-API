import express from "express"
import getData from "../controller/user/getData";
import checkAdmin from "../controller/user/checkAdmin";
import getPoint from "../controller/point/getPoint";
import getTransaction from "../controller/point/getTransaction";
import changePassword from "../controller/user/changePassword";
import editProfile from "../controller/user/editProfile";

const userRouter = express.Router();

userRouter.get('/data', getData);
userRouter.get('/isadmin', checkAdmin);
userRouter.get('/point', getPoint);
userRouter.get('/transaction', getTransaction);

userRouter.post('/changepassword', changePassword);

userRouter.put('/profile', editProfile);

export default userRouter;