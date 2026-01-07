import express, { NextFunction, Response } from "express";
import { ProjectController } from "../controllers/Project/ProjectController";
import { User } from "../middlewares/User";
import { AuthRequest } from "../types";
import { fileUpload } from "../middlewares/FileUpload";


const Project_Prefix = "/project";

const projectRouter = express.Router();

projectRouter.post(`${Project_Prefix}/addProject`, 
    (req: AuthRequest, res: Response, next: NextFunction) => User.authenticate(req, res, next),
    fileUpload.single("logo"),
    (req: AuthRequest, res: Response) => ProjectController.addProject(req, res));

projectRouter.patch(`${Project_Prefix}/:projectId/editProject`, 
    (req: AuthRequest, res: Response, next: NextFunction) => User.authenticate(req, res, next),
    fileUpload.single("logo"),
    (req: AuthRequest, res: Response) => ProjectController.editProject(req, res));

projectRouter.delete(`${Project_Prefix}/:projectId/delete`, 
    (req: AuthRequest, res: Response, next: NextFunction) => User.authenticate(req, res, next),
    (req: AuthRequest, res: Response) => ProjectController.deleteProject(req, res));

projectRouter.get(`${Project_Prefix}/readProject`, 
    (req: AuthRequest, res: Response, next: NextFunction) => User.authenticate(req, res, next),
    (req: AuthRequest, res: Response) => ProjectController.readProjects(req, res));

projectRouter.get(`${Project_Prefix}/:projectId/getAllAssociatedQA`, 
    (req: AuthRequest, res: Response, next: NextFunction) => User.authenticate(req, res, next),
    (req: AuthRequest, res: Response) => ProjectController.getAllAssociatedQA(req, res));

projectRouter.get(`${Project_Prefix}/:projectId/getAllAssociatedDeveloper`, 
    (req: AuthRequest, res: Response, next: NextFunction) => User.authenticate(req, res, next),
    (req: AuthRequest, res: Response) => ProjectController.getAllAssociatedDeveloper(req, res));


export default projectRouter;