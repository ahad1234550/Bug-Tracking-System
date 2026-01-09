import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { Exception } from "../helpers";
import { ErrorCodes, UserConstants } from "../constants";

export const allowRoles = (...allowedRoles: Array<"manager" | "qa" | "developer">) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user || !allowedRoles.includes(user.role)) {
        throw new Exception(
          UserConstants.MESSAGES.ROLE_UNAUTORIZED,
          ErrorCodes.UNAUTHORIZED,
          { reportError: true }
        );
      }

      next();
    } catch (error) {
      return res.status(error.code || ErrorCodes.UNAUTHORIZED).json(
        error.toJson ? error.toJson() : { message: error.message }
      );
    }
  };
};
