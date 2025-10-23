import { Router } from "express";
import {
  GetUsers,
  RegisterUser,
  LoginUser,
} from "../controllers/usersControllers";
import {
  validateRegister,
  validateLogin,
} from "../middlewares/usersInputValidationMiddleware";
import { multerUpload } from "../middlewares/multerMiddleware";

const router = Router();

// Get all users
router.get("/", GetUsers);

// Register user
router.post("/register", multerUpload, validateRegister, RegisterUser);

// Login user
router.post("/login", validateLogin, LoginUser);

export default router;
