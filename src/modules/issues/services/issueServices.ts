import axios from "axios";
import { HTTP_RESPONSE_CODE } from "../../../shared/constants";
import { HttpException } from "../../../shared/exception/exception";
import userModel from "../../auth/models/users";
import talesModel from "../../tales/models/tales";
import repositoryModel from "../../repo/models/repo";
import IssueModel from "../models/issues";

const createIssue = async (userId: string, taleId: string) => {
  try {
    const userData = await userModel.findById(userId);

    const githubToken = userData?.githubToken;

    if (!githubToken) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        "Github Token required"
      );
    }

    const taleData = await talesModel.findById(taleId);
    const workflowId = taleData?.workflowId;
    const repoData = await repositoryModel.findOne({ workflowId });

    if (!taleData) {
      throw new HttpException(HTTP_RESPONSE_CODE.NOT_FOUND, "Talez not found");
    }

    if (!repoData) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.NOT_FOUND,
        "Repository not found, May be repository not linked any more or doesn't exists"
      );
    }

    const issueData = {
      title: taleData?.title,
      body: taleData?.description,
    };

    const githubResponse = await axios.post(
      `https://api.github.com/repos/${repoData?.repoOwner}/${repoData?.repoName}/issues`,
      issueData,
      {
        headers: { Authorization: `Bearer ${githubToken}` },
      }
    );

    if (githubResponse.status === 201 && githubResponse.data) {
      const githubIssue = new IssueModel({
        title: githubResponse.data?.title,
        body: githubResponse?.data?.body,
        assignees: githubResponse?.data?.assignees,
        labels: githubResponse?.data?.labels,
        githubIssueId: githubResponse?.data?.id,
        githubIssueNumber: githubResponse?.data?.number,
        taleId: taleId,
        authorId: userId,
        status: githubResponse?.data?.state,
      });
      await githubIssue.save();
      return githubIssue;
    } else {
      throw new HttpException(
        githubResponse?.status,
        "Issue is not created. Please try after some while!"
      );
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default { createIssue };
