import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import githubAuthServices from "../services/githubAuthServices";

const githubAuth = (_req: Request, res: Response, _next: NextFunction) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo`;
  res.redirect(githubAuthUrl);
};

const githubCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const code = req.query.code as string;
  if (!code) {
    return res.status(400).send("Code not provided");
  }

  try {
    const { user } = await githubAuthServices.signInGitHubUser(code);

    if (!user) {
      res.status(400).json("UserId is required");
      return;
    }

    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "24h" }
    );
    res.redirect(`http://localhost:5173/auth-redirect/?token=${jwtToken}`);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default { githubAuth, githubCallback };
