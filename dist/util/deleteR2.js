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
exports.deleteR2 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const r2Client_1 = __importDefault(require("./r2Client"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const deleteR2 = (filename) => __awaiter(void 0, void 0, void 0, function* () {
    const Bucket = process.env.CLOUDFLARE_BUCKET_NAME;
    if (Bucket && r2Client_1.default) {
        const deleteObjectParams = {
            Bucket,
            Key: filename,
        };
        const command = new client_s3_1.DeleteObjectCommand(deleteObjectParams);
        yield r2Client_1.default.send(command);
    }
});
exports.deleteR2 = deleteR2;
