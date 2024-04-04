import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/users";
import { User } from "../types";
import dotenv from "dotenv";

dotenv.config();
const jwt_secret_key = process.env.JWT_SECRET_KEY;

const signUp = async (userData: User): Promise<User> => {
  try {
    const hashedPassword = await bcrypt.hash(userData?.password, 10);
    const newUser = new userModel({
      ...userData,
      password: hashedPassword,
      isVerified: false,
    });
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

const login = async (userData: any) => {
  try {
    const user = await userModel.findOne({ email: userData?.email });
    if (!user) {
      throw new Error("User Not Found");
    }
    const validPassword = await bcrypt.compare(
      userData?.password,
      user.password
    );
    if (!validPassword) {
      // Passwords don't match
      throw new Error("Account Credentials do not match");
    }
    if (!jwt_secret_key) return;
    const token = jwt.sign({ userId: user._id }, jwt_secret_key, {
      expiresIn: "2h",
    });
    return token;
  } catch (error) {
    console.error("Error Fetching User Details", error);
    throw error;
  }
};

const getUserById = async (userId: string) => {
  try {
    if (!userId) return;
    const getUser = await userModel.findById(userId, { password: 0 });

    return getUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default { signUp, login, getUserById };
