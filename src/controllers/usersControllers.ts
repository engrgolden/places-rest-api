import { Request, Response, NextFunction } from "express";
import {
  getAllUsers,
  registerUser,
  loginUser,
} from "../services/usersServices";
import { handleError } from "../models/CustomErrors";
import { uploadR2 } from "../util/uploadR2";
import { pullR2 } from "../util/pullR2";

export const GetUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await getAllUsers();
    await pullR2(users);
    res.json({ users });
  } catch (err) {
    return next(
      handleError(err, "Fetching users failed, please try again later.", 500)
    );
  }
};

export const RegisterUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    let fileName = "";
    if (req.file) {
      fileName = (await uploadR2(req.file)) || "";
    }

    const resData = await registerUser({ name, email, password, fileName });
    res.status(201).json(resData);
  } catch (err) {
    return next(
      handleError(err, "Registration failed. Please try again later", 500)
    );
  }
};

export const LoginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const resData = await loginUser({ email, password });
    res.status(200).json(resData);
  } catch (err) {
    return next(handleError(err, "Login failed, please try again later.", 500));
  }
};
