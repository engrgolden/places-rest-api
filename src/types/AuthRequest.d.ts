import { Request } from "express";

export interface AuthRequest extends Request {
  userData?: { userId: string };
}
