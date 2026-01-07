import { Request, Response } from "express";
import { ProjectManager } from "./ProjectManager";
import { Validators } from "../../helpers";
import { ErrorCodes } from "../../constants";
import { DeleteFile } from "../../middlewares/DeleteFile";

export class ProjectController {

    static async addProject(req: Request, res: Response): Promise<Response> {
        try {
            const { project, QA, developer } = await ProjectManager.addProject(req);

            return res.json({
                success: true,
                data: {
                    project,
                    QA,
                    developer
                }
            });

        } catch (error) {

            DeleteFile.delete(req.file.filename);

            const statusCode = Validators.validateCode(error.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR;
            
            return res.status(statusCode).json(
                error.toJson ? error.toJson() : { message: error.message, code: statusCode }
            );
        }
    }

    static async editProject(req: Request, res: Response): Promise<Response> {
        try {
            const { project, QA, developer } = await ProjectManager.editProject(req);

            return res.json({
                success: true,
                data: {
                    project,
                    QA,
                    developer
                }
            });

        } catch (error) {

            const statusCode = Validators.validateCode(error.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR;
            
            return res.status(statusCode).json(
                error.toJson ? error.toJson() : { message: error.message, code: statusCode }
            );
        }

    }
    static async deleteProject(req: Request, res: Response): Promise<Response> {
        try {
            const project = await ProjectManager.deleteProject(req);

            return res.json({
                success: true,
                data: {
                    project,
                    message: "Deleted Successfully"
                }
            });

        } catch (error) {

            const statusCode = Validators.validateCode(error.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR;
            
            return res.status(statusCode).json(
                error.toJson ? error.toJson() : { message: error.message, code: statusCode }
            );
        }
    }

    static async readProjects(req: Request, res: Response){
        try {
            const projects = await ProjectManager.readProjects(req);

            return res.json({
                success: true,
                data: projects
            });
        } catch (error) {

            const statusCode = Validators.validateCode(error.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR;

            return res.status(statusCode).json(
                error.toJson ? error.toJson() : { message: error.message, code: statusCode }
            );
        }
    }

    static async getAllAssociatedQA(req: Request, res: Response){
        try {
            const users = await ProjectManager.getAllAssociatedQA(req);

            return res.json({
                success: true,
                data: users
            });
        } catch (error) {

            const statusCode = Validators.validateCode(error.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR;

            return res.status(statusCode).json(
                error.toJson ? error.toJson() : { message: error.message, code: statusCode }
            );
        }
    }
    static async getAllAssociatedDeveloper(req: Request, res: Response){
        try {
            const users = await ProjectManager.getAllAssociatedDeveloper(req);

            return res.json({
                success: true,
                data: users
            });
        } catch (error) {

            const statusCode = Validators.validateCode(error.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR;

            return res.status(statusCode).json(
                error.toJson ? error.toJson() : { message: error.message, code: statusCode }
            );
        }
    }

    
}
