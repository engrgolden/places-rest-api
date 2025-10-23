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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = exports.getAllUsers = void 0;
// userService.ts
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const CustomErrors_1 = require("../models/CustomErrors");
const user_1 = __importDefault(require("../models/user"));
const jwt = require("jsonwebtoken");
dotenv_1.default.config();
const JWT_ENCRYPTION_KEY = process.env.JWT_ENCRYPTION_KEY;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.default.find({}, "-password");
    if (!users.length) {
        throw new CustomErrors_1.CustomError("empty", 404);
    }
    else {
        return users.map((user) => user.toObject({ getters: true }));
    }
});
exports.getAllUsers = getAllUsers;
const registerUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, email, password, fileName, }) {
    const existingUser = yield user_1.default.findOne({ email });
    if (existingUser) {
        throw new CustomErrors_1.CustomError("User with email already exists, kindly login instead", 409);
    }
    else {
        let hashedPassword;
        hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        const newUser = new user_1.default({
            name,
            email,
            fileName,
            password: hashedPassword,
            places: [],
        });
        yield newUser.save();
        let token;
        token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_ENCRYPTION_KEY, { expiresIn: "1h" });
        const newUserObject = newUser.toObject({ getters: true });
        return { id: newUserObject.id, email: newUserObject.email, token };
    }
});
exports.registerUser = registerUser;
const loginUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password }) {
    const existingUser = yield user_1.default.findOne({ email }).select("name places fileName password");
    if (!existingUser) {
        throw new CustomErrors_1.CustomError("Email not registered", 401);
    }
    let isValidPassword;
    isValidPassword = yield bcryptjs_1.default.compare(password, existingUser.password);
    if (!isValidPassword) {
        throw new CustomErrors_1.CustomError("Incorrect password", 401);
    }
    const existingUserObject = existingUser.toObject({
        getters: true,
    });
    let token;
    token = jwt.sign({ userId: existingUserObject.id, email: existingUserObject.email }, JWT_ENCRYPTION_KEY, { expiresIn: "1h" });
    return {
        id: existingUserObject.id,
        email: existingUserObject.email,
        token,
    };
});
exports.loginUser = loginUser;
