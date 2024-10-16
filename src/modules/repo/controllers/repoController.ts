import { NextFunction, Request, Response } from "express";

import repoServices from "../services/repoServices";
import Joi from "joi";
import { HttpException } from "../../../shared/exception/exception";
import { HTTP_RESPONSE_CODE } from "../../../shared/constants";
import {
  RequestBody,
  RequestParams,
  RequestQuery,
  ResponseBody,
} from "../../../types/express";
import axios from "axios";

const getUserRepo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const limit = req.paginate?.limit || 30;
    const offset = req.paginate?.offset || 0;

    const githubRepository = await repoServices.getGithubRepositories(
      userId,
      limit,
      offset
    );
    res.status(200).json(githubRepository);
  } catch (error) {
    next(error);
  }
};

const connectRepository = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response,
  next: NextFunction
) => {
  const repositorySchema = Joi.object({
    repo_id: Joi.string().trim().required().label("Repository Id"),
    repo_name: Joi.string().trim().required().label("Repository Name"),
    repo_owner_name: Joi.string()
      .trim()
      .required()
      .label("Repository Owner Name"),
    repo_clone_url: Joi.string()
      .trim()
      .required()
      .label("Repository Clone URL"),
    repo_ssh_url: Joi.string().trim().required().label("Repository SSH URL"),
    repo_git_url: Joi.string().trim().required().label("Repository Git URL"),
    repoOpenIssueCount: Joi.number().required().label("Repository Open Issue"),
    workflowId: Joi.string().trim().required().label("Workflow Id"),
  });
  try {
    const repoData = req.body;
    const userId = req?.user?.userId;
    if (!userId) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.UNAUTHORIZED,
        "User not authorised"
      );
    }
    if (!repoData) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        "Repo Data not found "
      );
    }
    const validatedResult = repositorySchema.validate(repoData, {
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

    const getRepositoryDetail = await repoServices.connectGithubRepo(
      validatedResult?.value,
      userId
    );

    if (!getRepositoryDetail) {
      res.status(500).json("Something Went Wrong");
      return;
    }
    res.status(200).json({
      message: "Linked Repository Successfully",
      repositoryDetails: getRepositoryDetail,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getConnectedRepo = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req?.user?.userId;
    const workflowId = req?.query?.workflowId;
    if (!userId) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.UNAUTHORIZED,
        "User not authorised"
      );
    }
    if (!workflowId) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.NOT_FOUND,
        "Workflow not found"
      );
    }

    const response = await repoServices.getConnectedRepo(workflowId, userId);

    res.status(200).json({
      connectedRepo: response,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteConnectedRepo = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req?.user?.userId;
    const workflowId = req?.query?.workflowId;

    if (!userId) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.UNAUTHORIZED,
        "User not authorised"
      );
    }
    if (!workflowId) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.NOT_FOUND,
        "Workflow not found"
      );
    }

    const response = await repoServices.deleteConnectedRepo(workflowId, userId);
    if (!response) {
      res.status(500).json("Something Went Wrong");
      return;
    }

    res.status(200).json({
      message: "Successfully Disonnected Repository",
      connectedRepo: response,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default {
  getUserRepo,
  connectRepository,
  getConnectedRepo,
  deleteConnectedRepo,
};
