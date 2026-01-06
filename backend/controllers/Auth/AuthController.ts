import { Request, Response } from "express";
import AuthManager from "./AuthManager";
import { ErrorCodes, UserConstants } from "../../constants";
import { Validators } from "../../helpers";
import { User } from "../../constants/User";

export default class AuthController {
    static async signup(req: Request, res: Response): Promise<Response> {

        try {
            const user = await AuthManager.signup(req.body);

            res.json({
                success: true,
                data: user
            })
        } catch (error) {
            return res.status(Validators.validateCode(error.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.reportError ? error.message : UserConstants.MESSAGES.SIGN_UP_FAILED
            });
        }
    }

    static async login(req: Request, res: Response): Promise<Response> {

        try {
            const user = await AuthManager.login(req, res);

            res.json({
                success: true,
                data: user
            })
        } catch (error) {
            return res.status(Validators.validateCode(error.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.reportError ? error.message : UserConstants.MESSAGES.LOGIN_FAILED
            });
        }
    }

    static logout(req: Request, res: Response) {
        try {
            AuthManager.logout(req, res);

            res.json({
                success: true,
                data: {
                    message: User.MESSAGES.LOGOUT
                }
            })
        } catch (error) {
            return res.status(Validators.validateCode(error.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.reportError ? error.message : UserConstants.MESSAGES.LOGOUT_FAILED
            });
        }
    }

}