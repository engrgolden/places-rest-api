import { check } from "express-validator";
import { EndIfErrors } from "./validationMiddleware";

// Reusable validation middleware for email and password
export const validateLogin = [
  check("email")
    .normalizeEmail()
    .isEmail()
    .not()
    .isEmpty()
    .withMessage("Valid email is required"),
  check("password")
    .isLength({ min: 8 })
    .not()
    .isEmpty()
    .withMessage("Password must be at least 8 characters"),
  EndIfErrors,
];

// Validation for registration (name + email + password)
export const validateRegister = [
  check("name").not().isEmpty().withMessage("Name is required"),
  ...validateLogin,
];
