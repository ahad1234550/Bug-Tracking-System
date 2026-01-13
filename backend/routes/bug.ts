import express from "express";
import { fileUpload } from "../middlewares/FileUpload";
import { BugController } from "../controllers/Bug/BugController";
import { allowRoles } from "../middlewares/AllowRoles";


const bug_Prefix = "/bug";

const bugRouter = express.Router();

bugRouter.post(`${bug_Prefix}`, 
    allowRoles("qa"),
    fileUpload.single("screenshot"), BugController.addBug);

bugRouter.get(`${bug_Prefix}/:projectId`, BugController.readBug);

bugRouter.patch(`${bug_Prefix}/:bugId`, BugController.changeBugStatus);

bugRouter.delete(`${bug_Prefix}/:bugId`, BugController.deleteBug);

export default bugRouter;