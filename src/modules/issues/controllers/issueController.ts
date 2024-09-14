import Joi from "joi";
import { HTTP_RESPONSE_CODE } from "../../../shared/constants";
import { HttpException } from "../../../shared/exception/exception";
import {
  RequestBody,
  RequestParams,
  RequestQuery,
  ResponseBody,
} from "../../../types/express";
import issueServices from "../services/issueServices";
import { NextFunction, Request, Response } from "express";

const createIssue = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const taleId = req?.query?.taleId;
    const userId = req.user?.userId;

    if (!userId) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.UNAUTHORIZED,
        "User not authorised!"
      );
    }

    if (!taleId) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        "Tales Id not found "
      );
    }

    const response = await issueServices.createIssue(userId, taleId);

    res
      .status(201)
      .json({ issue: response, message: "Issue created successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default { createIssue };
