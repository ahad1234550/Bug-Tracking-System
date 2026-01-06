import express, { NextFunction, Response } from "express";
import { ProjectController } from "../controllers/Project/ProjectController";
import { User } from "../middlewares/User";
import { AuthRequest } from "../types";
import { fileUpload } from "../middlewares/FileUpload";


const Project_Prefix = "/project";

const projectRouter = express.Router();

projectRouter.post(`${Project_Prefix}/add`, 
    (req: AuthRequest, res: Response, next: NextFunction) => User.authenticate(req, res, next),
    fileUpload.single("logo"),
    (req: AuthRequest, res: Response) => ProjectController.addProject(req, res));

projectRouter.post(`${Project_Prefix}/edit`, 
    (req: AuthRequest, res: Response, next: NextFunction) => User.authenticate(req, res, next),
    fileUpload.single("logo"),
    (req: AuthRequest, res: Response) => ProjectController.editProject(req, res));

projectRouter.post(`${Project_Prefix}/delete`, 
    (req: AuthRequest, res: Response, next: NextFunction) => User.authenticate(req, res, next),
    (req: AuthRequest, res: Response) => ProjectController.deleteProject(req, res));

projectRouter.get(`${Project_Prefix}/read`, 
    (req: AuthRequest, res: Response, next: NextFunction) => User.authenticate(req, res, next),
    (req: AuthRequest, res: Response) => ProjectController.readProjects(req, res));

projectRouter.get(`${Project_Prefix}/getallassociatedqa`, 
    (req: AuthRequest, res: Response, next: NextFunction) => User.authenticate(req, res, next),
    (req: AuthRequest, res: Response) => ProjectController.getAllAssociatedQA(req, res));

projectRouter.get(`${Project_Prefix}/getallassociateddeveloper`, 
    (req: AuthRequest, res: Response, next: NextFunction) => User.authenticate(req, res, next),
    (req: AuthRequest, res: Response) => ProjectController.getAllAssociatedDeveloper(req, res));


export default projectRouter;