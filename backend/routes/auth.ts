import express from "express";
import AuthController from "../controllers/Auth/AuthController";


const Auth_Prefix = "/auth";

const authRouter = express.Router();

authRouter.post(`${Auth_Prefix}/signup`, AuthController.signup);
authRouter.post(`${Auth_Prefix}/login`, AuthController.login);
authRouter.post(`${Auth_Prefix}/logout`,AuthController.logout)

export default authRouter;