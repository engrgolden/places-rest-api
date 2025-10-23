"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerUpload = void 0;
const multer = require("multer");
const storage = multer.memoryStorage();
exports.multerUpload = multer({
    storage,
}).single("image");
