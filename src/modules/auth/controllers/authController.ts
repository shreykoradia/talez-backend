import { NextFunction, Request, Response } from "express";
import authServices from "../services/authServices";
import Joi from "joi";
import jwt from "jsonwebtoken";
import userModel from "../models/users";
import { sendEmailVerification } from "../../../shared/mail-service/email";
import { HTTP_RESPONSE_CODE } from "../../../shared/constants";

const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
      res
        .status(HTTP_RESPONSE_CODE.BAD_REQUEST)
        .json(errors.map((err) => err?.message));
      return;
    }
    const validatedUserData = validatedResult.value;

    const newUser = await authServices.signUp(validatedUserData);

    res
      .status(HTTP_RESPONSE_CODE.CREATED)
      .json({ msg: "Account created successfully" });

    const user = await userModel.findOne({ email: newUser?.email });

    if (!user?._id) {
      res
        .status(HTTP_RESPONSE_CODE.NOT_FOUND)
        .json({ message: "User Not Found" });
    }

    if (jwt_secret_key) {
      const token = jwt.sign(
        { userId: user?._id, email: newUser.email },
        jwt_secret_key,
        { expiresIn: "10m" }
      );
      sendEmailVerification(validatedUserData.email, token);
    }
  } catch (error) {
    next(error);
  }
};

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
      res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json(errors);
      return;
    }
    const validatedUserData = validatedResult.value;
    const access_token = await authServices.login(validatedUserData);
    res.status(HTTP_RESPONSE_CODE.SUCCESS).json({ access_token });
  } catch (error) {
    next(error);
  }
};

const getUserDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req?.user?.userId;
    const response = await authServices.getUserById(userId);
    res.status(HTTP_RESPONSE_CODE.SUCCESS).json({ user: response });
  } catch (error) {
    next(error);
  }
};

export default { signUp, login, getUserDetail };
