import { HTTP_RESPONSE_CODE } from "./../../../shared/constants/index";
import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import linkService from "../services/linkService";
import {
  RequestParams,
  RequestQuery,
  ResponseBody,
} from "../../../types/express";
import { HttpException } from "../../../shared/exception/exception";

interface RequestBody {}

const addLink = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response,
  next: NextFunction
) => {
  const linkValidationSchema = Joi.object({
    linkUrl: Joi.string().trim().required().label("link"),
    linkTitle: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .required()
      .label("link-title"),
  });

  try {
    const linkData = req.body;
    const { query } = req;
    const taleId = query?.taleId;
    const userId = req?.user?.userId;

    if (!userId) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.UNAUTHORIZED,
        " User not authorised"
      );
    }
    if (!taleId) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.NOT_FOUND,
        " Tale Id not found"
      );
    }
    if (!linkData) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        "Link Data not found "
      );
    }

    const validatedResult = linkValidationSchema.validate(linkData, {
      abortEarly: false,
    });

    if (validatedResult.error) {
      const errors = validatedResult.error.details.map((detail) => ({
        field: detail?.context?.key,
        message: detail?.message,
      }));
      res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json(errors);
      return;
    }

    const newLink = await linkService.addLink(
      taleId,
      userId,
      validatedResult?.value
    );
    if (!newLink) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.SERVER_ERROR,
        "New Link was not added due to some technical issue"
      );
    } else {
      res
        .status(HTTP_RESPONSE_CODE.CREATED)
        .json({ link: newLink, msg: "Link successfully added" });
    }
  } catch (err) {
    console.error("Something Went Wrong!", err);
    next(err);
  }
};

const getLink = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { query } = req;
    const taleId = query.taleId;
    const userId = req?.user?.userId;

    if (!taleId) {
      return res
        .status(HTTP_RESPONSE_CODE.BAD_REQUEST)
        .json({ message: "TaleId is required" });
    }

    if (!userId) {
      return res
        .status(HTTP_RESPONSE_CODE.BAD_REQUEST)
        .json({ message: "User Id is required" });
    }

    const linksResponse = await linkService.getLinks(taleId);

    if (!linksResponse) {
      return res
        .status(HTTP_RESPONSE_CODE.SERVER_ERROR)
        .json({ message: "Something went wrong" });
    }

    return res
      .status(HTTP_RESPONSE_CODE.SUCCESS)
      .json({ links: linksResponse, linkCount: linksResponse.length });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const deleteLink = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { query } = req;
    const taleId = query?.taleId;
    const userId = req?.user?.userId;
    const linkId = req?.params?.linkId;

    if (!taleId) {
      return res
        .status(HTTP_RESPONSE_CODE.BAD_REQUEST)
        .json({ message: "TaleId is required" });
    }

    if (!linkId) {
      return res
        .status(HTTP_RESPONSE_CODE.BAD_REQUEST)
        .json({ message: "link Id is required" });
    }

    if (!userId) {
      return res
        .status(HTTP_RESPONSE_CODE.BAD_REQUEST)
        .json({ message: "User Id is required" });
    }

    const linksResponse = await linkService.deleteLink(taleId, linkId);

    if (!linksResponse) {
      return res
        .status(HTTP_RESPONSE_CODE.SERVER_ERROR)
        .json({ message: "Something went wrong" });
    }

    return res
      .status(HTTP_RESPONSE_CODE.SUCCESS)
      .json({ message: "Link deleted successfully" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default { addLink, getLink, deleteLink };
