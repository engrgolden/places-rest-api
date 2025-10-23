"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const CustomErrors_1 = require("./models/CustomErrors");
const placesRoutes_1 = __importDefault(require("./routes/placesRoutes"));
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
        res.sendStatus(204);
    }
    else {
        next();
    }
});
// Routes
app.use("/api/places", placesRoutes_1.default);
app.use("/api/users", usersRoutes_1.default);
// 404 Error Handler
app.use((req, res, next) => {
    const err = new CustomErrors_1.CustomError("Could not find this route.", 404);
    next(err);
});
// Global Error Handler
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res
        .status(err.code || 500)
        .json({ message: err.message || "An unknown error occurred" });
});
exports.default = app;
