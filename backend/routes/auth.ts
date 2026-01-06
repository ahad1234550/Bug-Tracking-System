import express, { Request, Response } from "express";
import AuthController from "../controllers/Auth/AuthController";


const Auth_Prefix = "/auth";

const authRouter = express.Router();

authRouter.post(`${Auth_Prefix}/signup`, (req: Request, res: Response) => AuthController.signup(req, res));
authRouter.post(`${Auth_Prefix}/login`, (req: Request, res: Response) => AuthController.login(req, res));
authRouter.get(`${Auth_Prefix}/logout`,(req: Request, res: Response) => AuthController.logout(req, res))
export default authRouter;