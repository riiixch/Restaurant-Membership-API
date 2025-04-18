import express from "express"
import getUserData from "../controller/user/getUserData";

const userRouter = express.Router();

userRouter.get('/data', getUserData);

export default userRouter;