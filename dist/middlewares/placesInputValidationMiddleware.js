"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdatePlace = exports.validateCreatePlace = exports.validatePlaceTitleDescription = void 0;
const express_validator_1 = require("express-validator");
const validationMiddleware_1 = require("./validationMiddleware");
// Reusable validation middleware for title and description (used in multiple routes)
exports.validatePlaceTitleDescription = [
    (0, express_validator_1.check)("title").not().isEmpty().withMessage("Title is required"),
    (0, express_validator_1.check)("description")
        .isLength({ min: 5 })
        .withMessage("Description must be at least 5 characters long"),
    validationMiddleware_1.EndIfErrors,
];
// Validation for place creation
exports.validateCreatePlace = [
    (0, express_validator_1.check)("address").not().isEmpty().withMessage("Address is required"),
    ...exports.validatePlaceTitleDescription,
];
// Validation for place update (title + description)
exports.validateUpdatePlace = [
    (0, express_validator_1.check)("address").not().isEmpty().withMessage("Address is required"),
    ...exports.validatePlaceTitleDescription,
];
