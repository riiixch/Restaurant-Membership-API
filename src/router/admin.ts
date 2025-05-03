import express from "express";
import addPoint from "../controller/point/addPoint";

const adminRouter = express.Router();

adminRouter.post('/point', addPoint);

export default adminRouter;