import express, { NextFunction, Response } from "express";
import { UserController } from "../controllers/User/UserController";
import { User } from "../middlewares/User";
import { AuthRequest } from "../types";


const User_Prefix = "/user";

const userRouter = express.Router();

userRouter.get(`${User_Prefix}/profile`, 
    (req: AuthRequest, res: Response, next: NextFunction) => User.authenticate(req, res, next),
    (req: AuthRequest, res: Response) => UserController.profile(req, res));

userRouter.post(`${User_Prefix}/updateprofile`,
    (req: AuthRequest, res: Response, next: NextFunction) => User.authenticate(req, res, next),
    (req: AuthRequest, res: Response) => UserController.updateProfile(req, res));

export default userRouter