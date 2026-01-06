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

            DeleteFile.delete(req.file.filename);

            const statusCode = Validators.validateCode(error.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR;

            return res.status(statusCode).json(
                error.toJson ? error.toJson() : { message: error.message, code: statusCode }
            );
        }
    }

    static async readBug(req: Request, res: Response): Promise<Response> {
        try {
            const bugs = await BugManager.readBug(req);

            return res.json({
                success: true,
                data: bugs
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

}