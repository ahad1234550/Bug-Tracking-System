import { Router, Response } from "express";
import authRouter from "./auth";
import userRouter from "./user";
import projectRouter from "./project";
import bugRouter from "./bug";
import { User } from "../middlewares/User";

const router = Router();

router.get("/", (res: Response) => {
  res.render("index");
});

router.use('/api/', [authRouter]);

router.use(User.authenticate);

router.use('/api/', [userRouter, projectRouter, bugRouter]);


export default router;
