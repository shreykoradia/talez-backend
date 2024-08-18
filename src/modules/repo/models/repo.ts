import { model, Schema } from "mongoose";
import { RepositorySchema } from "../types";

const repositorySchema = new Schema<RepositorySchema>({
  workflowId: {
    type: String,
    required: true,
  },
  repoId: {
    type: String,
    required: true,
  },
  repoName: {
    type: String,
    required: true,
  },
  repoOwner: {
    type: String,
    required: true,
  },
  repoCloneUrl: {
    type: String,
    required: true,
  },
  repoGitUrl: {
    type: String,
    required: true,
  },
  repoSSHUrl: {
    type: String,
    required: true,
  },
  repoOpenIssueCount: {
    type: Number,
    required: true,
  },
});

const repositoryModel = model<RepositorySchema>(
  "Repositories",
  repositorySchema
);

export default repositoryModel;
