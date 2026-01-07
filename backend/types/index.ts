import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: "manager" | "qa" | "developer" | string;
  };
  file?: Express.Multer.File;
}
