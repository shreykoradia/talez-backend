import { NextFunction, Request, Response } from "express";
import {
  RequestBody,
  RequestParams,
  RequestQuery,
  ResponseBody,
} from "../../../types/express";
import Joi from "joi";
import shareServices from "../services/shareServices";
import { HTTP_RESPONSE_CODE } from "../../../shared/constants";

const inviteUser = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response,
  next: NextFunction
) => {
  const inviteUserValidationSchema = Joi.object({
    email: Joi.string().trim().email().required().label("Email"),
    role: Joi.string()
      .valid("can_edit", "can_view", "full_access")
      .required()
      .label("Role"),
  });
  try {
    const userId = req.user?.userId;
    const workflowId = req.query?.workflowId || "";
    const userData = req.body;
    const validatedResult = inviteUserValidationSchema.validate(userData, {
      abortEarly: false,
    });
    if (validatedResult.error) {
      const errors = validatedResult.error.details.map((detail) => ({
        field: detail?.context?.key,
        message: detail?.message,
      }));
      res.status(HTTP_RESPONSE_CODE.UNPROCESSABLE_ENTITY).json(errors);
      return;
    }
    const validatedData = validatedResult.value;

    if (!workflowId)
      res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json("Requires a Workflow Id");

    const response = await shareServices.inviteUser(
      workflowId,
      userId,
      validatedData
    );
    res
      .status(HTTP_RESPONSE_CODE.SUCCESS)
      .json({ invitedUser: response, msg: "Invite Added Successfully" });
  } catch (error) {
    console.log("Something Went Wrong!", error);
    next(error);
  }
};

const getUsersWithAccess = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req?.user?.userId;
    const workflowId = req?.query?.workflowId || "";

    if (!userId) {
      res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json("User Id required");
    }

    if (!workflowId) {
      res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json("Workflow Id required");
    }

    const response = await shareServices.getUsersWithAccess(userId, workflowId);
    res.status(HTTP_RESPONSE_CODE.SUCCESS).json({ shared_users: response });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateAccess = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response,
  next: NextFunction
) => {
  const updateUserValidation = Joi.object({
    email: Joi.string().trim().email().required().label("Email"),
    role: Joi.string()
      .valid("can_edit", "can_view", "full_access")
      .required()
      .label("Role"),
  });
  try {
    const userId = req.user?.userId;
    const workflowId = req.query?.workflowId || "";
    const userData = req.body;
    const validatedResult = updateUserValidation.validate(userData, {
      abortEarly: false,
    });
    if (validatedResult.error) {
      const errors = validatedResult.error.details.map((detail) => ({
        field: detail?.context?.key,
        message: detail?.message,
      }));
      res.status(HTTP_RESPONSE_CODE.UNPROCESSABLE_ENTITY).json(errors);
      return;
    }
    if (!workflowId)
      res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json("Requires a Workflow Id");
    const validatedData = validatedResult.value;

    const response = await shareServices.updateAccess(
      userId,
      workflowId,
      validatedData
    );
    res
      .status(HTTP_RESPONSE_CODE.SUCCESS)
      .json({ msg: "Access Updated Successfully", response });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const removeAccess = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response,
  next: NextFunction
) => {
  const removeValidationSchema = Joi.object({
    email: Joi.string().trim().email().required().label("Email"),
  });
  try {
    const userId = req.user?.userId;
    const userData = req?.body;
    const workflowId = req.query?.workflowId || "";
    const validatedResult = removeValidationSchema.validate(userData, {
      abortEarly: false,
    });
    if (!userId) {
      res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json("UserId is Required");
    }
    if (!workflowId) {
      res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json("WorkflowId is Required");
    }
    if (validatedResult.error) {
      const errors = validatedResult.error.details.map((detail) => ({
        field: detail?.context?.key,
        message: detail?.message,
      }));
      res.status(HTTP_RESPONSE_CODE.UNPROCESSABLE_ENTITY).json(errors);
      return;
    }
    const validatedData = validatedResult.value;
    const response = await shareServices.removeAccess(
      workflowId,
      validatedData
    );
    res
      .status(HTTP_RESPONSE_CODE.SUCCESS)
      .json({ msg: "Removed User Successfully", removed_user: response });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default { inviteUser, getUsersWithAccess, updateAccess, removeAccess };
