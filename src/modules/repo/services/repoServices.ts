import dotenv from "dotenv";
import axios from "axios";
import { HTTP_RESPONSE_CODE } from "../../../shared/constants";
import { HttpException } from "../../../shared/exception/exception";
import userModel from "../../auth/models/users";
import { RepositoryPayload } from "../types";
import repositoryModel from "../models/repo";

dotenv.config();

const getGithubRepositories = async (
  userId: string,
  limit: number,
  offset: number
) => {
  try {
    const page = Math.floor(offset / limit) + 1;

    const userDetail = await userModel.findById(userId);

    if (!userDetail || !userDetail.githubToken) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.UNAUTHORIZED,
        "User unauthorized or GitHub token missing"
      );
    }

    try {
      const githubResponse = await axios.get(
        "https://api.github.com/user/repos",
        {
          headers: { Authorization: `Bearer ${userDetail.githubToken}` },
          params: { page: page, per_page: limit },
        }
      );

      const nextPageData = await axios.get(
        "https://api.github.com/user/repos",
        {
          headers: { Authorization: `Bearer ${userDetail.githubToken}` },
          params: { page: page + 1, per_page: limit },
        }
      );

      const hasMoreData = nextPageData.data.length > 0;
      const repoResponse = githubResponse.data;

      return { repositories: repoResponse, hasMoreData: hasMoreData };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // AxiosError specific handling
        if (error.response?.status === 401) {
          throw new HttpException(
            HTTP_RESPONSE_CODE.UNAUTHORIZED,
            "GitHub token is expired or invalid. Reauthorization triggered."
          );
        }
        throw new HttpException(
          HTTP_RESPONSE_CODE.SERVER_ERROR,
          error.message || "An error occurred with the GitHub API"
        );
      } else if (error instanceof Error) {
        // Generic Error handling
        console.error("Error:", error.message);
        throw new HttpException(
          HTTP_RESPONSE_CODE.SERVER_ERROR,
          error.message || "An unknown error occurred"
        );
      } else {
        console.error("Unknown error type:", error);
        throw new HttpException(
          HTTP_RESPONSE_CODE.SERVER_ERROR,
          "An unknown error occurred"
        );
      }
    }
  } catch (error) {
    if (error instanceof HttpException) {
      // Properly handle HttpException if thrown
      throw error;
    } else if (error instanceof Error) {
      console.error("Error:", error.message);
      throw new HttpException(
        HTTP_RESPONSE_CODE.SERVER_ERROR,
        error.message || "An error occurred"
      );
    } else {
      console.error("Unknown error:", error);
      throw new HttpException(
        HTTP_RESPONSE_CODE.SERVER_ERROR,
        "An unknown error occurred"
      );
    }
  }
};

const connectGithubRepo = async (
  repoData: RepositoryPayload,
  userId: string
) => {
  try {
    if (!userId) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.UNAUTHORIZED,
        "User not authorised"
      );
    }

    const userRepoAlreadyLinked = await repositoryModel.find({
      repoId: repoData?.repo_id,
      workflowId: repoData?.workflowId,
    });

    if (userRepoAlreadyLinked.length > 0) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.CONFLICT,
        "Repository Already Linked"
      );
    } else {
      const savedResponse = new repositoryModel({
        repoId: repoData.repo_id,
        repoName: repoData.repo_name,
        repoOwner: repoData.repo_owner_name,
        repoCloneUrl: repoData.repo_clone_url,
        repoGitUrl: repoData.repo_git_url,
        repoSSHUrl: repoData.repo_ssh_url,
        repoOpenIssueCount: repoData.repoOpenIssueCount,
        workflowId: repoData.workflowId,
      });

      await savedResponse.save();
      return savedResponse;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getConnectedRepo = async (workflowId: string, userId: string) => {
  try {
    if (!userId) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.UNAUTHORIZED,
        " User not authorised"
      );
    }

    const connectRepository = await repositoryModel.findOne({
      workflowId: workflowId,
    });

    return connectRepository;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteConnectedRepo = async (workflowId: string, userId: string) => {
  try {
    if (!userId) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.UNAUTHORIZED,
        " User not authorised"
      );
    }

    const deleteRepo = await repositoryModel.findOneAndDelete({
      workflowId: workflowId,
    });

    return deleteRepo;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  getGithubRepositories,
  connectGithubRepo,
  getConnectedRepo,
  deleteConnectedRepo,
};
