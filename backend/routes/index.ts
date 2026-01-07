import { Router, Request, Response } from "express";
import authRouter from "./auth";
import userRouter from "./user";
import projectRouter from "./project";
import bugRouter from "./bug";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.render("index");
});
router.use('/api/', [authRouter, userRouter, projectRouter, bugRouter]);

export default router;
