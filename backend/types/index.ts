import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: "manager" | "qa" | "developer";
  };
  file?: Express.Multer.File;
}
