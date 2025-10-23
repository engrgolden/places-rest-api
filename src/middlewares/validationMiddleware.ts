import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { CustomError } from "../models/CustomErrors";

// Middleware to handle validation errors
export const EndIfErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new CustomError("Invalid inputs passed, please check your data.", 422)
    );
  }
  next();
};
