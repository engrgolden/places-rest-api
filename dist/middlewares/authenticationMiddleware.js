"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndIfNotAuth = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const CustomErrors_1 = require("../models/CustomErrors");
const jwt = require("jsonwebtoken");
dotenv_1.default.config();
const JWT_ENCRYPTION_KEY = process.env.JWT_ENCRYPTION_KEY;
const EndIfNotAuth = (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next();
    }
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return next(new CustomErrors_1.CustomError("Authentication failed.", 403));
        }
        const decodedToken = jwt.verify(token, JWT_ENCRYPTION_KEY);
        req.userData = { userId: decodedToken.userId };
        next();
    }
    catch (err) {
        throw new CustomErrors_1.CustomError("Authentication failed.", 403);
    }
};
exports.EndIfNotAuth = EndIfNotAuth;
