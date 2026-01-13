import { Request, Response } from "express";
import { ProjectManager } from "./ProjectManager";
import { Validators } from "../../helpers";
import { ErrorCodes } from "../../constants";
import { DeleteFile } from "../../middlewares/DeleteFile";

export class ProjectController {

    static async addProject(req: Request, res: Response): Promise<Response> {
        try {
            const { project, projectUser } = await ProjectManager.addProject(req);

            return res.json({
                success: true,
                data: {
                    project,
                    projectUser,
                }
            });

        } catch (error) {

            const filePath = "uploads/" + req.file.filename;

            console.log(filePath);

            DeleteFile.delete(filePath);

            const statusCode = Validators.validateCode(error.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR;

            return res.status(statusCode).json(
                error.toJson ? error.toJson() : { message: error.message, code: statusCode }
            );
        }
    }

    static async editProject(req: Request, res: Response): Promise<Response> {
        try {
            const updatedProject = await ProjectManager.editProject(req);

            return res.json({
                success: true,
                data: {
                    updatedProject,
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

    static async readProjects(req: Request, res: Response): Promise<Response> {
        try {
            const { projects, role } = await ProjectManager.readProjects(req);

            return res.json({
                success: true,
                data: {
                    projects,
                    role
                }
            });
        } catch (error) {

            const statusCode = Validators.validateCode(error.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR;

            return res.status(statusCode).json(
                error.toJson ? error.toJson() : { message: error.message, code: statusCode }
            );
        }
    }

    static async getAllAssociatedQA(req: Request, res: Response) {
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

    static async getAllQA(req: Request, res: Response) {
        try {
            const users = await ProjectManager.getAllQA(req);

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
    static async getAllDeveloper(req: Request, res: Response) {
        try {
            const users = await ProjectManager.getAllDeveloper(req);

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
    static async getAllAssociatedDeveloper(req: Request, res: Response) {
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
