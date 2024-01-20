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

const updateProfileCard = async (
  req: Request,
  res: Response
): Promise<void> => {
  const profileCardSchema = Joi.object({
    desired_anime_charecter: Joi.string()
      .trim()
      .max(280)
      .optional()
      .label("Status"),
    favourite_artist: Joi.string().trim().max(280).optional().label("Status"),
    favourite_manga: Joi.string().trim().max(280).optional().label("Status"),
    favourite_story: Joi.string().trim().max(280).optional().label("Status"),
    favourite_genre: Joi.string().trim().max(280).optional().label("Status"),
  });
  try {
    const userId = req.user?.userId;
    const profileCardData = req.body;
    if (!profileCardData) {
      return;
    }
    const validatedData = profileCardSchema.validate(profileCardData, {
      abortEarly: false,
    });
    if (validatedData?.error) {
      const errors = validatedData.error.details.map((detail) => ({
        field: detail?.context?.key,
        message: detail?.message,
      }));
      res.status(400).json({ errors });
    }
    const updatedUserData = await profileServices.updateProfileCard(
      userId,
      req.body
    );
    if (!updatedUserData) {
      return;
    }
    res.status(200).json({ message: "Profile Card Updated Successfully" });
  } catch (error) {
    console.error(error, "Error Updating the Profile Card");
    res.status(500).json({ error });
    return;
  }
};

export default { updateProfileHeader, updateProfileCard };
