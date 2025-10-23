import dotenv from "dotenv";
import { Response, NextFunction } from "express";

import { CustomError } from "../models/CustomErrors";
import { AuthRequest } from "../types/AuthRequest";

const jwt = require("jsonwebtoken");

dotenv.config();
const JWT_ENCRYPTION_KEY = process.env.JWT_ENCRYPTION_KEY as string;

export const EndIfNotAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization!.split(" ")[1];
    if (!token) {
      return next(new CustomError("Authentication failed.", 403));
    }
    const decodedToken = jwt.verify(token, JWT_ENCRYPTION_KEY);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    throw new CustomError("Authentication failed.", 403);
  }
};
