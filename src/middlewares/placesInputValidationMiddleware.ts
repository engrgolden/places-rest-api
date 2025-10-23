import { check } from "express-validator";
import { EndIfErrors } from "./validationMiddleware";

// Reusable validation middleware for title and description (used in multiple routes)
export const validatePlaceTitleDescription = [
  check("title").not().isEmpty().withMessage("Title is required"),
  check("description")
    .isLength({ min: 5 })
    .withMessage("Description must be at least 5 characters long"),
  EndIfErrors,
];

// Validation for place creation
export const validateCreatePlace = [
  check("address").not().isEmpty().withMessage("Address is required"),
  ...validatePlaceTitleDescription,
];

// Validation for place update (title + description)
export const validateUpdatePlace = [
  check("address").not().isEmpty().withMessage("Address is required"),
  ...validatePlaceTitleDescription,
];
