import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import config from "config";
import { Token } from "../helpers";
import { ErrorCodes, UserConstants } from "../constants";
import { AuthRequest } from "../types";

export class User {
  static authenticate(req: AuthRequest, res: Response, next: NextFunction): Response | void {
    
    const accessToken = Token.getCookie(req, "accessToken");

    try {
      if (accessToken) {
        const decoded = jwt.verify(accessToken, config.secretKey) as {
          id: number;
          role: "manager" | "qa" | "developer";
        };
        req.user = {
          id: decoded.id,
          role: decoded.role,
        };
        return next();
      }

      const refreshToken = Token.getCookie(req, "refreshToken");
      if (!refreshToken) {
        return res.status(ErrorCodes.UNAUTHORIZED).json({
          success: false,
          message: UserConstants.MESSAGES.TOKEN_IS_INVALID_OR_EXPIRED,
        });
      }

      const decodedRefresh = jwt.verify(refreshToken, config.secretKey);

      Token.accessToken(res, decodedRefresh.id, decodedRefresh.role);
      Token.refreshToken(res, decodedRefresh.id, decodedRefresh.role);

      req.user = {
        id: decodedRefresh.id,
        role: decodedRefresh.role,
      };
      return next();
    } catch (err) {
      return res.status(ErrorCodes.UNAUTHORIZED).json({
        success: false,
        message: UserConstants.MESSAGES.TOKEN_IS_INVALID_OR_EXPIRED,
      });
    }
  }
}
