import { Request, Response } from "express";
import { BugManager } from "./BugManager";
import { DeleteFile } from "../../middlewares/DeleteFile";
import { Validators } from "../../helpers";
import { ErrorCodes } from "../../constants";

export class BugController {
    static async addBug(req: Request, res: Response): Promise<Response> {
        try {
            const bug = await BugManager.addBug(req);

            return res.json({
                success: true,
                data: bug
            })

        } catch (error) {

            const filePath = "uploads/"+req.file.filename;

            console.log(filePath);

            DeleteFile.delete(filePath);

            const statusCode = Validators.validateCode(error.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR;

            return res.status(statusCode).json(
                error.toJson ? error.toJson() : { message: error.message, code: statusCode }
            );
        }
    }

    static async readBug(req: Request, res: Response): Promise<Response> {
        try {
            const {bugs, role} = await BugManager.readBug(req);

            return res.json({
                success: true,
                data: {bugs, role}
            })
        } catch (error) {
            const statusCode = Validators.validateCode(error.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR;

            return res.status(statusCode).json(
                error.toJson ? error.toJson() : { message: error.message, code: statusCode }
            );
        }
    }

    static async changeBugStatus(req: Request, res: Response): Promise<Response> {
        try {
            const bug = await BugManager.changeBugStatus(req);
            return res.json({
                success: true,
                data: bug
            })
        } catch (error) {
            const statusCode = Validators.validateCode(error.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR;

            return res.status(statusCode).json(
                error.toJson ? error.toJson() : { message: error.message, code: statusCode }
            );
        }
    }

    static async deleteBug(req: Request, res: Response): Promise<Response> {
        try {
            const bug = await BugManager.deleteBug(req);
            return res.json({
                success: true,
                data: {bug , message: "Deleted Successfully"}
            })
        } catch (error) {
            const statusCode = Validators.validateCode(error.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR;

            return res.status(statusCode).json(
                error.toJson ? error.toJson() : { message: error.message, code: statusCode }
            );
        }
    }

}