import { NextFunction, Request, Response } from "express";
import { APP_ERROR_MESSAGE } from "../constants";
import { HttpException } from "../exception/exception";

function errorHandler(
  error: HttpException,
  _request: Request,
  response: Response,
  _next: NextFunction
) {
  const status = error.status ? error.status : 500;
  const message =
    status === 500 ? APP_ERROR_MESSAGE.serverError : error.message;

  // Set it to only development using env
  // const errors = error.error;

  response.status(status).send({ status, message });
}

export default errorHandler;
