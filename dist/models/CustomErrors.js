"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.CustomError = void 0;
class CustomError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError);
        }
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
exports.CustomError = CustomError;
const handleError = (err, failMessage, failCode) => err instanceof CustomError
    ? err
    : failMessage && failCode && new CustomError(failMessage, failCode);
exports.handleError = handleError;
