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
exports.uploadR2 = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const client_s3_1 = require("@aws-sdk/client-s3");
const r2Client_1 = __importDefault(require("./r2Client"));
const uuid_1 = require("uuid");
dotenv_1.default.config();
const uploadR2 = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const name = (0, uuid_1.v4)() + "." + file.mimetype.split("/")[1];
    const Bucket = process.env.CLOUDFLARE_BUCKET_NAME;
    if (Bucket && r2Client_1.default) {
        const params = {
            Bucket,
            Key: name,
            Body: file.buffer,
            ContentType: file.mimetype,
        };
        const command = new client_s3_1.PutObjectCommand(params);
        yield r2Client_1.default.send(command);
        return name;
    }
});
exports.uploadR2 = uploadR2;
