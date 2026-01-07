import { Request, Response } from "express";
import { UserManager } from "./UserManager";
import { Validators } from "../../helpers";
import { ErrorCodes, UserConstants } from "../../constants";



export class UserController {
    static async getProfile(req: Request, res: Response): Promise<Response> {
        try {
            const user = await UserManager.getProfile(req);
            res.json({
                success: true,
                data: user
            })
        } catch (error) {
            return res.status(Validators.validateCode(error.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.reportError ? error.message : UserConstants.MESSAGES.FETCHING_USER_DATA_FAILED
            });
        }
    }

    static async updateProfile (req: Request, res: Response): Promise<Response> {
        try {
            const user = await UserManager.updateProfile(req);
            res.json({
                success: true,
                data: user
            })
        } catch (error) {
            return res.status(Validators.validateCode(error.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.reportError ? error.message : UserConstants.MESSAGES.UPDATING_USER_DATA_FAILED
            });
        }
    }
}