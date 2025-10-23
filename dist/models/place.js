"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Define the schema for Place
const placeSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true, // Automatically trims spaces from the title
    },
    description: {
        type: String,
        required: true,
        minlength: 5, // Enforces minimum length for description
    },
    fileName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
        trim: true, // Automatically trims spaces from the address
    },
    coordinates: {
        lat: {
            type: Number,
            required: true,
            min: -90, // Latitude should be between -90 and 90
            max: 90,
        },
        lng: {
            type: Number,
            required: true,
            min: -180, // Longitude should be between -180 and 180
            max: 180,
        },
    },
    creatorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User", // Reference to the User model
    },
});
// Export the model
exports.default = mongoose_1.default.model("Place", placeSchema);
