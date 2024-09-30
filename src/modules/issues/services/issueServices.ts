import axios from "axios";
import { HTTP_RESPONSE_CODE } from "../../../shared/constants";
import { HttpException } from "../../../shared/exception/exception";
import userModel from "../../auth/models/users";
import talesModel from "../../tales/models/tales";
import repositoryModel from "../../repo/models/repo";
import IssueModel from "../models/issues";
import feedbackModel from "../../feedback/models/feedback";
import analyzeFeedbacks from "./analyzeFeedback";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY || "");

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

    const feedbackData = await feedbackModel.aggregate([
      {
        $lookup: {
          from: "reactions",
          localField: "_id",
          foreignField: "feedbackId",
          as: "reactions",
        },
      },
      {
        $addFields: {
          upvotes: {
            $size: {
              $filter: {
                input: "$reactions",
                as: "reaction",
                cond: { $eq: ["$$reaction.voteType", "upvote"] },
              },
            },
          },
          downvotes: {
            $size: {
              $filter: {
                input: "$reactions",
                as: "reaction",
                cond: { $eq: ["$$reaction.voteType", "downvote"] },
              },
            },
          },
        },
      },
      {
        $project: {
          reactions: 0,
        },
      },
    ]);

    if (!taleData) {
      throw new HttpException(HTTP_RESPONSE_CODE.NOT_FOUND, "Talez not found");
    }

    if (!repoData) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.NOT_FOUND,
        "Repository not found, May be repository not linked any more or doesn't exists"
      );
    }

    const { analyzedFeedbacks, overallSentiment } = await analyzeFeedbacks(
      feedbackData
    );

    const context = {
      tale: taleData,
      feedbacks: feedbackData,
      sentiment_analyzed_feedbacks: analyzedFeedbacks,
      sentiments: overallSentiment,
    };

    const feedbacks = analyzedFeedbacks
      .map(
        (feedback) =>
          `Feedback: "${feedback.feedback}", Score: ${feedback.sentimentScore})`
      )
      .join("\n");

    const promptInput = `
Given the tale description: "${context?.tale?.description}".

You have the following feedbacks with sentiment analysis (suggest the best feedbacks if available, otherwise provide a scalable solution):
${
  feedbacks.length === 0
    ? "No feedbacks available. Please suggest a scalable solution."
    : feedbacks
}

Total Sentiment Analysis: Score (${context?.sentiments})

Please generate:
- A summarized concise feature / bug descriptions
- Clear acceptance criteria
- Scalable solutions (based on feedbacks or provided insights)
- QA checks to ensure the solution meets quality standards.
`;

    const result = await model.generateContent(promptInput);

    const issueData = {
      title: taleData?.title,
      body: result?.response?.text(),
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
