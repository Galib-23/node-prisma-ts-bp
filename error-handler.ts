import { NextFunction, Request, Response } from "express";
import { ErrorCode, HttpException } from "./src/exceptions/root";
import { InternalException } from "./src/exceptions/internal-exceptions";
import { ZodError } from "zod";
import { UnprocessableEntity } from "./src/exceptions/validation";

export const errorHandler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error: any) {
      let exception: HttpException;
      if (error instanceof HttpException) {
        exception = error;
      } else if(error instanceof ZodError) {
        exception = new UnprocessableEntity("Validation failed", error.format(), ErrorCode.UNPROCESSABLE_ENTITY);
      } else {
        exception = new InternalException(
          "Something went wrong!",
          error,
          ErrorCode.INTERNAL_EXCEPTION,
        );
      }
      next(exception);
    }
  };
};
