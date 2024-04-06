import { Request, Response } from "express";
import {
  RequestBody,
  RequestParams,
  RequestQuery,
  ResponseBody,
} from "../../../types/express";
import Joi from "joi";

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
    const workflowId = req.query?.workflowId;
    const userData = req.body;
    const validatedResult = inviteUserValidationSchema.validate(userData, {
      abortEarly: false,
    });
    if (validatedResult.error) {
      const errors = validatedResult.error.details.map((detail) => ({
        field: detail?.context?.key,
        message: detail?.message,
      }));
      res.status(400).json(errors);
      return;
    }
    const validatedData = validatedResult.value;

    // const response = await shareServices.inviteUser(validatedData , workflow)
  } catch (error) {
    console.log("Something Went Wrong!", error);
    res.status(500).json("Something Went Wrong Huh!");
  }
};

export default { inviteUser };
