import { Request, Response } from "express";
import Joi from "joi";
import profileServices from "../services/profileServices";

const updateProfileHeader = async (
  req: Request,
  res: Response
): Promise<void> => {
  const updateProfileSchema = Joi.object({
    username: Joi.string().trim().min(3).max(15).optional().label("Username"),
    email: Joi.string().trim().email().optional().label("Email"),
    status: Joi.string().trim().max(280).optional().label("Status"),
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
      res.status(400).json({ errors });
    }
    // Todo --- Convert the Validatate to the profile services
    // const validatedUserData = validatedData?.value;
    const updatedUserData = await profileServices.updateProfileServices(
      userId,
      req.body
    );
    if (!updatedUserData) {
      return;
    }
    res.status(200).json({ message: "Profile Updated Successfully" });
  } catch (errors) {
    console.log("Something Went Wrong!", errors);
    res.status(500).json({ errors });
  }
};

export default { updateProfileHeader };
