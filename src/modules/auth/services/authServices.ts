import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/users";
import { User } from "../types";
import dotenv from "dotenv";
import { HttpException } from "../../../shared/exception/exception";
import { HTTP_RESPONSE_CODE } from "../../../shared/constants";

dotenv.config();
const jwt_secret_key = process.env.JWT_SECRET_KEY;

const signUp = async (userData: User): Promise<User> => {
  try {
    const existingUser = await userModel.findOne({ email: userData?.email });
    if (existingUser) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.CONFLICT,
        "Email already registered"
      );
    }
    const hashedPassword = await bcrypt.hash(userData?.password, 10);
    const newUser = new userModel({
      ...userData,
      password: hashedPassword,
      isVerified: false,
    });
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    console.error("Error Creating User:", error);
    throw error;
  }
};

const login = async (userData: any) => {
  try {
    const user = await userModel.findOne({ email: userData?.email });
    if (!user) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.NOT_FOUND,
        "User doesn't exist"
      );
    }
    const validPassword = await bcrypt.compare(
      userData?.password,
      user.password
    );
    if (!validPassword) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.FORBIDDEN,
        "Invalid credentials, Password do not match :("
      );
    }
    if (!jwt_secret_key) return;
    const token = jwt.sign({ userId: user._id }, jwt_secret_key, {
      expiresIn: "24h",
    });
    return token;
  } catch (error) {
    console.error("Error Logging In User:", error);
    throw error;
  }
};

const getUserById = async (userId: string) => {
  try {
    if (!userId) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.NOT_FOUND,
        "User Id do not exists"
      );
    }
    const getUser = await userModel.findById(userId, { password: 0 });
    if (!getUser) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.NOT_FOUND,
        "User do not exists"
      );
    }
    return getUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default { signUp, login, getUserById };
