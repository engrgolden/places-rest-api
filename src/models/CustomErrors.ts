export class CustomError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export const handleError = (
  err: CustomError | unknown,
  failMessage?: string,
  failCode?: number
) =>
  err instanceof CustomError
    ? err
    : failMessage && failCode && new CustomError(failMessage, failCode);
