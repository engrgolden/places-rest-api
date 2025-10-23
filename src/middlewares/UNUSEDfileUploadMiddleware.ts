import { v4 as uuidv4 } from "uuid";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../models/CustomErrors";
const multer = require("multer");

const MIME_TYPE_MAP: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const MAX_FILE_SIZE = 500 * 1024;

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, "uploads/images");
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, `${uuidv4()}.${ext}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: null | Error, acceptFile: boolean) => void
): void => {
  const isValidType = Boolean(MIME_TYPE_MAP[file.mimetype]);

  if (!isValidType) {
    return cb(
      new CustomError(
        "Invalid file type. Only PNG, JPG, and JPEG are allowed.",
        400
      ),
      false
    );
  }

  cb(null, true);
};

const fileUpload = (req: Request, res: Response, next: NextFunction) => {
  const upload = multer({
    storage,
    fileFilter,
  }).single("image");

  upload(req, res, (err: any) => {
    if (err) {
      return next(new CustomError(err.message, 400));
    }

    if (req.file && req.file.size > MAX_FILE_SIZE) {
      return next(new CustomError("File size exceeds 500KB limit.", 400));
    }

    next();
  });
};

export default fileUpload;
