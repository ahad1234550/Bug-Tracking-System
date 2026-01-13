import express, { Response } from "express";
import { ProjectController } from "../controllers/Project/ProjectController";
import { AuthRequest } from "../types";
import { fileUpload } from "../middlewares/FileUpload";
import { allowRoles } from "../middlewares/AllowRoles";


const Project_Prefix = "/project";

const projectRouter = express.Router();

projectRouter.post(`${Project_Prefix}/addProject`,
    allowRoles("manager"),
    fileUpload.single("logo"),
    (req: AuthRequest, res: Response) => ProjectController.addProject(req, res));

projectRouter.get(`${Project_Prefix}/readProject`,
    (req: AuthRequest, res: Response) => ProjectController.readProjects(req, res));

projectRouter.patch(`${Project_Prefix}/:projectId/editProject`,
    allowRoles("manager"),
    fileUpload.single("logo"),
    (req: AuthRequest, res: Response) => ProjectController.editProject(req, res));

projectRouter.delete(`${Project_Prefix}/:projectId/delete`,
    allowRoles("manager"),
    (req: AuthRequest, res: Response) => ProjectController.deleteProject(req, res));


projectRouter.get(`${Project_Prefix}/:projectId/getAllAssociatedQA`,
    (req: AuthRequest, res: Response) => ProjectController.getAllAssociatedQA(req, res));

projectRouter.get(`${Project_Prefix}/getAllQA`,
    (req: AuthRequest, res: Response) => ProjectController.getAllQA(req, res));

projectRouter.get(`${Project_Prefix}/:projectId/getAllAssociatedDeveloper`,
    (req: AuthRequest, res: Response) => ProjectController.getAllAssociatedDeveloper(req, res));

projectRouter.get(`${Project_Prefix}/getAllDeveloper`,
    (req: AuthRequest, res: Response) => ProjectController.getAllDeveloper(req, res));

export default projectRouter;