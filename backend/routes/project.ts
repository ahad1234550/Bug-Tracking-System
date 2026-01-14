import express from "express";
import { ProjectController } from "../controllers/Project/ProjectController";
import { fileUpload } from "../middlewares/FileUpload";
import { allowRoles } from "../middlewares/AllowRoles";


const Project_Prefix = "/project";

const projectRouter = express.Router();

projectRouter.post(`${Project_Prefix}`,
    allowRoles("manager"),
    fileUpload.single("logo"),
    ProjectController.addProject);

projectRouter.get(`${Project_Prefix}`, ProjectController.readProjects);

projectRouter.patch(`${Project_Prefix}/:projectId`,
    allowRoles("manager"),
    fileUpload.single("logo"),
    ProjectController.editProject);

projectRouter.delete(`${Project_Prefix}/:projectId`,
    allowRoles("manager"), ProjectController.deleteProject);

projectRouter.get(`${Project_Prefix}/:projectId/getAllAssociatedQA`, ProjectController.getAllAssociatedQA);

projectRouter.get(`${Project_Prefix}/getAllQA`, ProjectController.getAllQA);

projectRouter.get(`${Project_Prefix}/:projectId/getAllAssociatedDeveloper`, ProjectController.getAllAssociatedDeveloper);

projectRouter.get(`${Project_Prefix}/getAllDeveloper`, ProjectController.getAllDeveloper);

export default projectRouter;