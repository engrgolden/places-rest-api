"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usersControllers_1 = require("../controllers/usersControllers");
const usersInputValidationMiddleware_1 = require("../middlewares/usersInputValidationMiddleware");
const multerMiddleware_1 = require("../middlewares/multerMiddleware");
const router = (0, express_1.Router)();
// Get all users
router.get("/", usersControllers_1.GetUsers);
// Register user
router.post("/register", multerMiddleware_1.multerUpload, usersInputValidationMiddleware_1.validateRegister, usersControllers_1.RegisterUser);
// Login user
router.post("/login", usersInputValidationMiddleware_1.validateLogin, usersControllers_1.LoginUser);
exports.default = router;
