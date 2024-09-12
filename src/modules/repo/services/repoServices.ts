import axios from "axios";
import { HTTP_RESPONSE_CODE } from "../../../shared/constants";
import { HttpException } from "../../../shared/exception/exception";
import userModel from "../../auth/models/users";
import { RepositoryPayload } from "../types";
import repositoryModel from "../models/repo";

const getGithubRepositories = async (
  userId: string,
  limit: number,
  offset: number
) => {
  try {
    const page = Math.floor(offset / limit) + 1;

    const userDetail = await userModel.findById(userId);
    const githubToken = userDetail?.githubToken;
    if (!userDetail || !githubToken) {
      return new HttpException(401, "User unauthorised");
    }

    const githubResponse = await axios.get(
      "https://api.github.com/user/repos",
      {
        headers: { Authorization: `Bearer ${githubToken}` },
        params: { page: page, per_page: limit },
      }
    );

    const nextPageData = await axios.get("https://api.github.com/user/repos", {
      headers: { Authorization: `Bearer ${githubToken}` },
      params: { page: page + 1, per_page: limit },
    });

    const hasMoreData = nextPageData.data.length === 0 ? false : true;

    const repoResponse = githubResponse.data;

    return { repositories: repoResponse, hasMoreData: hasMoreData };
  } catch (error) {
    console.log(error);
    throw error;
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
        " User not authorised"
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
