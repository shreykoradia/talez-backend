import { Request, Response } from "express";
import {
  RequestBody,
  RequestParams,
  RequestQuery,
  ResponseBody,
} from "../../../types/express";
import Joi from "joi";
import shareServices from "../services/shareServices";

const inviteUser = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response
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
      res.status(422).json(errors);
      return;
    }
    const validatedData = validatedResult.value;

    if (!workflowId) res.status(400).json("Requires a Workflow Id");

    const response = await shareServices.inviteUser(
      workflowId,
      userId,
      validatedData
    );
    res
      .status(200)
      .json({ invitedUser: response, msg: "Invite Added Successfully" });
  } catch (error) {
    console.log("Something Went Wrong!", error);
    res.status(500).json("Something Went Wrong Huh!");
  }
};

const getUsersWithAccess = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response
) => {
  try {
    const userId = req?.user?.userId;
    const workflowId = req?.query?.workflowId || "";

    if (!userId) {
      res.status(400).json("User Id not found");
    }

    if (!workflowId) {
      res.status(400).json("Workflow Id required");
    }

    const response = await shareServices.getUsersWithAccess(userId, workflowId);
    console.log(response);
    res.status(200).json({ shared_users: response });
  } catch (error) {
    console.log(error);
    res.status(500).json("Something Went Wrong!");
  }
};

const updateAccess = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response
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
      res.status(422).json(errors);
      return;
    }
    if (!workflowId) res.status(400).json("Requires a Workflow Id");
    const validatedData = validatedResult.value;

    const response = await shareServices.updateAccess(
      userId,
      workflowId,
      validatedData
    );
    res.status(200).json({ msg: "Access Updated Successfully", response });
  } catch (error) {
    console.log(error);
    res.status(500).json("Something Went Wrong huh!");
  }
};

const removeAccess = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response
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
      res.status(400).json("UserId is Required");
    }
    if (!workflowId) {
      res.status(422).json("WorkflowId is Required");
    }
    if (validatedResult.error) {
      const errors = validatedResult.error.details.map((detail) => ({
        field: detail?.context?.key,
        message: detail?.message,
      }));
      res.status(422).json(errors);
      return;
    }
    const validatedData = validatedResult.value;
    const response = await shareServices.removeAccess(
      workflowId,
      validatedData
    );
    res
      .status(200)
      .json({ msg: "Removed User Successfully", removed_user: response });
  } catch (error) {
    console.log(error);
    res.status(500).json("Something Went Wrong Huh!");
  }
};

export default { inviteUser, getUsersWithAccess, updateAccess, removeAccess };
