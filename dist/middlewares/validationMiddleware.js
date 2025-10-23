"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndIfErrors = void 0;
const express_validator_1 = require("express-validator");
const CustomErrors_1 = require("../models/CustomErrors");
// Middleware to handle validation errors
const EndIfErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new CustomErrors_1.CustomError("Invalid inputs passed, please check your data.", 422));
    }
    next();
};
exports.EndIfErrors = EndIfErrors;
