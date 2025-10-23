import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  process.exit(1); // Exit if no DB URI is found
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed::", err);
    process.exit(1);
  });
