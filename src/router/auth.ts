import express from "express"
import authLogin from "../controller/auth/authLogin";
import authRegister from "../controller/auth/authRegister";

const authRouter = express.Router();

authRouter.post('/login', authLogin);
authRouter.post('/register', authRegister);

export default authRouter;