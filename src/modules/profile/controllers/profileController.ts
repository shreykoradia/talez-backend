import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import profileServices from "../services/profileServices";
import { HTTP_RESPONSE_CODE } from "../../../shared/constants";

const updateProfileHeader = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const updateProfileSchema = Joi.object({
    username: Joi.string().trim().min(3).max(15).optional().label("Username"),
    email: Joi.string().trim().email().optional().label("Email"),
    status: Joi.string().trim().max(280).optional().empty("").label("Status"),
  });
  try {
    const userId = req.user?.userId;
    const userData = req.body;
    if (!userData) {
      return;
    }
    const validatedData = updateProfileSchema.validate(userData, {
      abortEarly: false,
    });
    if (validatedData?.error) {
      const errors = validatedData.error.details.map((detail) => ({
        field: detail?.context?.key,
        message: detail?.message,
      }));
      res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({ errors });
    }
    const validatedUserData = validatedData?.value;
    const updatedUserData = await profileServices.updateProfileServices(
      userId,
      validatedUserData
    );
    if (!updatedUserData) {
      return;
    }
    res
      .status(HTTP_RESPONSE_CODE.SUCCESS)
      .json({ message: "Profile Updated Successfully" });
  } catch (errors) {
    next(errors);
  }
};

export default { updateProfileHeader };
