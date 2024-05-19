import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/users";
import { markEmailAsVerified } from "../services/verificationMailServices";
import { sendEmailVerification } from "../../../shared/mail-service/email";

const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.params;

  if (!token) {
    res.status(400).json({ error: "Token is missing" });
    return;
  }

  const jwt_secret_key = process.env.JWT_SECRET_KEY;

  try {
    if (!jwt_secret_key) return;
    const decoded = jwt.verify(token, jwt_secret_key) as {
      userId: string;
      email: string;
    };
    const { userId } = decoded;

    const user = await userModel.findById(userId);

    if (!user || user.isVerified) {
      res.status(400).json({ error: "Invalid or expired token" });
      return;
    }

    await markEmailAsVerified(userId);
    res.status(200).json({ message: "Email verification successful" });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

const getVerifyEmail = async (req: Request, res: Response) => {
  try {
    const userId = req?.user?.userId;
    const jwt_secret_key = process.env.JWT_SECRET_KEY;

    if (!userId) {
      res.status(400).json("User id not found");
    }
    const user = await userModel.findById(userId);
    if (!user) {
      res.status(400).json("User not found");
      return;
    }
    if (jwt_secret_key) {
      const token = jwt.sign(
        { userId: user?._id, email: user?.email },
        jwt_secret_key,
        { expiresIn: "10m" }
      );
     sendEmailVerification(user.email, token);
     res.status(200).json("Yay, verification email have been sent!")

    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something Went Wrong huh!" });
  }
};

export default { verifyEmail, getVerifyEmail };
