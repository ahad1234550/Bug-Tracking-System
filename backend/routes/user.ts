import express, { NextFunction, Response } from "express";
import { UserController } from "../controllers/User/UserController";
import { User } from "../middlewares/User";
import { AuthRequest } from "../types";


const User_Prefix = "/user";

const userRouter = express.Router();

userRouter.get(`${User_Prefix}/me`, 
    (req: AuthRequest, res: Response) => UserController.getProfile(req, res));

userRouter.patch(`${User_Prefix}/updateProfile`,
    (req: AuthRequest, res: Response) => UserController.updateProfile(req, res));

export default userRouter