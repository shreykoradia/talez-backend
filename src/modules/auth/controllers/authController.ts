import { Request, Response } from "express";
import authServices from "../services/authServices";
import Joi from "joi";
import jwt from "jsonwebtoken";
// import { sendEmailVerification } from "../../../shared/mail-service/email";
import userModel from "../models/users";

const signUp = async (req: Request, res: Response): Promise<void> => {
  const signUpValidationSchema = Joi.object({
    username: Joi.string().trim().min(3).max(15).required().label("Username"),
    email: Joi.string().trim().email().required().label("Email"),
    password: Joi.string().min(6).max(20).required().label("Password"),
  });

  const jwt_secret_key = process.env.JWT_SECRET_KEY;

  try {
    const userData = req.body;
    const validatedResult = signUpValidationSchema.validate(userData, {
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
    const validatedUserData = validatedResult.value;

    const existingUsername = await userModel.findOne({
      username: userData?.username,
    });
    if (existingUsername) {
      res.status(400).json({ message: "Email is already in use" });
      return;
    }
    const existingUser = await userModel.findOne({ email: userData?.email });
    if (existingUser) {
      res.status(400).json({ message: "Email is already in use" });
      return;
    }

    const newUser = await authServices.signUp(validatedUserData);

    res.status(201).json(newUser);

    const user = await userModel.findOne({ email: newUser?.email });

    if (!user?._id) {
      res.status(404).json({ error: "User Not Found" });
    }

    if (jwt_secret_key) {
      const token = jwt.sign(
        { userId: user?._id, email: newUser.email },
        jwt_secret_key,
        { expiresIn: "10m" }
      );
      // sendEmailVerification(validatedUserData.email, token);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  const loginValidatonSchema = Joi.object({
    username: Joi.string().trim().min(3).max(15).optional().label("Username"),
    email: Joi.string().trim().email().optional().label("Email"),
    password: Joi.string().min(6).max(20).required().label("Password"),
  });

  try {
    const userData = req.body;
    const validatedResult = loginValidatonSchema.validate(userData, {
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
    const validatedUserData = validatedResult.value;
    const access_token = await authServices.login(validatedUserData);
    res.status(200).json({ access_token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default { signUp, login };
