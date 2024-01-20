import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const jwt_secret_key = process.env.JWT_SECRET_KEY;

export const authenticateToken = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized- Token not Provided " });
    }
    if (!jwt_secret_key) {
      throw new Error("Something Went Wrong!");
    }
    const verifiedUser = jwt.verify(token, jwt_secret_key);
    req.user = verifiedUser;
    next();
  } catch (error) {
    res.status(500).json(error);
    return;
  }
};
