const multer = require("multer");

const storage = multer.memoryStorage();

export const multerUpload = multer({
  storage,
}).single("image");
