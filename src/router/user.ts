import express from "express"
import getData from "../controller/user/getData";

const userRouter = express.Router();

userRouter.get('/data', getData);

export default userRouter;