import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import githubAuthServices from "../services/githubAuthServices";

dotenv.config();

interface RequestParams {}

interface ResponseBody {}

interface RequestBody {}

interface RequestQuery {
  token?: string;
}

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

const githubAuth = (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response,
  _next: NextFunction
) => {
  const userToken = req?.query?.token;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo&state=${userToken}`;
  res.redirect(githubAuthUrl);
};

const githubCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const code = req.query.code as string;
  const state = req.query.state as string;
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

  if (!code) {
    return res.status(400).send("Code not provided");
  }

  let decodedToken: DecodedToken | null = null;

  if (state && JWT_SECRET_KEY) {
    try {
      decodedToken = jwt.verify(state, JWT_SECRET_KEY) as DecodedToken;
    } catch (error) {
      console.log("State is undefined in the github authorization api", error);
    }
  }

  try {
    const { user } = await githubAuthServices.signInGitHubUser(
      code,
      decodedToken
    );

    if (!user) {
      res.status(400).json("UserId is required");
      return;
    }

    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "24h" }
    );
    res.redirect(
      `${process.env.FRONTEND_PROD_URL}/auth-redirect/?token=${jwtToken}`
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default { githubAuth, githubCallback };
