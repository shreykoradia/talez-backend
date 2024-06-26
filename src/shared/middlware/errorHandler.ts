import { NextFunction, Request, Response } from "express";
import { APP_ERROR_MESSAGE } from "../constants";
import { HttpException } from "../exception/exception";

function errorHandler(
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const status = error.status ? error.status : 500;
  const message =
    status === 500 ? APP_ERROR_MESSAGE.serverError : error.message;
  const errors = error.error;
  response.status(status).send({ status, message, error: errors });
}

export default errorHandler;
