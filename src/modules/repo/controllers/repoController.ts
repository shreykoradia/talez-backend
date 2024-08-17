import { NextFunction, Request, response, Response } from "express";

import repoServices from "../services/repoServices";

const getUserRepo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req?.user?.userId;
    const limit = req?.paginate?.limit || 30;
    const offset = req?.paginate?.offset || 0;

    const githubRepository = await repoServices.getGithubRepositories(
      userId,
      limit,
      offset
    );
    res.status(200).json(githubRepository);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const connectRepository = async () => {};

export default { getUserRepo, connectRepository };
