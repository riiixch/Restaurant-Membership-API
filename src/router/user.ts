import express from "express"
import getUserData from "../controller/user/getUserData";
import newCard from "../controller/user/newCard";

const userRouter = express.Router();

userRouter.get('/data', getUserData);
userRouter.post('/card', newCard);

export default userRouter;