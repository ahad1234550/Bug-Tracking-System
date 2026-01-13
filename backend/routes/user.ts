import express from "express";
import { UserController } from "../controllers/User/UserController";

const User_Prefix = "/user";

const userRouter = express.Router();

userRouter.get(`${User_Prefix}/me`, UserController.getProfile);

userRouter.patch(`${User_Prefix}/updateProfile`, UserController.updateProfile);

export default userRouter