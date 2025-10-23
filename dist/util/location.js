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
exports.getCoordinatesForAddress = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const CustomErrors_1 = require("../models/CustomErrors");
dotenv_1.default.config();
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const getCoordinatesForAddress = (address) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`;
        const res = yield axios_1.default.get(url);
        const data = res.data;
        if (!data || data.status === "ZERO_RESULTS") {
            throw new CustomErrors_1.CustomError("Could not find location for the specified address", 422);
        }
        const coordinates = data.results[0].geometry.location;
        return coordinates;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            throw new CustomErrors_1.CustomError("Failed to communicate with the Google Maps API.", 500);
        }
        else {
            throw new CustomErrors_1.CustomError("Failed to get coordinates for the address.", 500);
        }
        throw error;
    }
});
exports.getCoordinatesForAddress = getCoordinatesForAddress;
