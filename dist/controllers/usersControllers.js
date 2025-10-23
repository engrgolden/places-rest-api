"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUser = exports.RegisterUser = exports.GetUsers = void 0;
const usersServices_1 = require("../services/usersServices");
const CustomErrors_1 = require("../models/CustomErrors");
const uploadR2_1 = require("../util/uploadR2");
const pullR2_1 = require("../util/pullR2");
const GetUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, usersServices_1.getAllUsers)();
        yield (0, pullR2_1.pullR2)(users);
        res.json({ users });
    }
    catch (err) {
        return next((0, CustomErrors_1.handleError)(err, "Fetching users failed, please try again later.", 500));
    }
});
exports.GetUsers = GetUsers;
const RegisterUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        let fileName = "";
        if (req.file) {
            fileName = (yield (0, uploadR2_1.uploadR2)(req.file)) || "";
        }
        const resData = yield (0, usersServices_1.registerUser)({ name, email, password, fileName });
        res.status(201).json(resData);
    }
    catch (err) {
        return next((0, CustomErrors_1.handleError)(err, "Registration failed. Please try again later", 500));
    }
});
exports.RegisterUser = RegisterUser;
const LoginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const resData = yield (0, usersServices_1.loginUser)({ email, password });
        res.status(200).json(resData);
    }
    catch (err) {
        return next((0, CustomErrors_1.handleError)(err, "Login failed, please try again later.", 500));
    }
});
exports.LoginUser = LoginUser;
