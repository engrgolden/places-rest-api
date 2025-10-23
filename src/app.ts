import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { CustomError } from "./models/CustomErrors";
import placesRoutes from "./routes/placesRoutes";
import usersRoutes from "./routes/usersRoutes";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
  } else {
    next();
  }
});

// Routes
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

// 404 Error Handler
app.use((req, res, next) => {
  const err = new CustomError("Could not find this route.", 404);
  next(err);
});

// Global Error Handler
app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }
  res
    .status(err.code || 500)
    .json({ message: err.message || "An unknown error occurred" });
});

export default app;
