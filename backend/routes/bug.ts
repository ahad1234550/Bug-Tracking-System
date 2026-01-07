import express, { NextFunction, Response } from "express";
import { User } from "../middlewares/User";
import { AuthRequest } from "../types";
import { fileUpload } from "../middlewares/FileUpload";
import { BugController } from "../controllers/Bug/BugController";


const bug_Prefix = "/bug";

const bugRouter = express.Router();

bugRouter.post(`${bug_Prefix}/addBug`, 
    (req: AuthRequest, res: Response, next: NextFunction) => User.authenticate(req, res, next),
    fileUpload.single("screenshot"),
    (req: AuthRequest, res: Response) => BugController.addBug(req, res));

bugRouter.get(`${bug_Prefix}/:projectId/readBug`, 
    (req: AuthRequest, res: Response, next: NextFunction) => User.authenticate(req, res, next),
    (req: AuthRequest, res: Response) => BugController.readBug(req, res));

bugRouter.patch(`${bug_Prefix}/:bugId/changeStatus`, 
    (req: AuthRequest, res: Response, next: NextFunction) => User.authenticate(req, res, next),
    (req: AuthRequest, res: Response) => BugController.changeBugStatus(req, res));
export default bugRouter;