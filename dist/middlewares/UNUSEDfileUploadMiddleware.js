"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const CustomErrors_1 = require("../models/CustomErrors");
const multer = require("multer");
const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
};
const MAX_FILE_SIZE = 500 * 1024;
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/images");
    },
    filename: (req, file, cb) => {
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, `${(0, uuid_1.v4)()}.${ext}`);
    },
});
const fileFilter = (req, file, cb) => {
    const isValidType = Boolean(MIME_TYPE_MAP[file.mimetype]);
    if (!isValidType) {
        return cb(new CustomErrors_1.CustomError("Invalid file type. Only PNG, JPG, and JPEG are allowed.", 400), false);
    }
    cb(null, true);
};
const fileUpload = (req, res, next) => {
    const upload = multer({
        storage,
        fileFilter,
    }).single("image");
    upload(req, res, (err) => {
        if (err) {
            return next(new CustomErrors_1.CustomError(err.message, 400));
        }
        if (req.file && req.file.size > MAX_FILE_SIZE) {
            return next(new CustomErrors_1.CustomError("File size exceeds 500KB limit.", 400));
        }
        next();
    });
};
exports.default = fileUpload;
