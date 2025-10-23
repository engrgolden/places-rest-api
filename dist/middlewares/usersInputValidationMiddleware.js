"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = exports.validateLogin = void 0;
const express_validator_1 = require("express-validator");
const validationMiddleware_1 = require("./validationMiddleware");
// Reusable validation middleware for email and password
exports.validateLogin = [
    (0, express_validator_1.check)("email")
        .normalizeEmail()
        .isEmail()
        .not()
        .isEmpty()
        .withMessage("Valid email is required"),
    (0, express_validator_1.check)("password")
        .isLength({ min: 8 })
        .not()
        .isEmpty()
        .withMessage("Password must be at least 8 characters"),
    validationMiddleware_1.EndIfErrors,
];
// Validation for registration (name + email + password)
exports.validateRegister = [
    (0, express_validator_1.check)("name").not().isEmpty().withMessage("Name is required"),
    ...exports.validateLogin,
];
