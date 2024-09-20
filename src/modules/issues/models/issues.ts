import { Schema, model, Document } from "mongoose";

// Interface representing an Issue document in MongoDB
interface IssueDocument extends Document {
  title: string;
  body: string | null;
  assignees: string[];
  labels: string[];
  githubIssueId: number;
  githubIssueNumber: number;
  taleId: string;
  authorId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const issueSchema = new Schema<IssueDocument>({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    default: null,
  },
  assignees: {
    type: [String],
    default: [],
  },
  labels: {
    type: [String],
    default: [],
  },
  githubIssueId: {
    type: Number,
    required: false,
  },
  githubIssueNumber: {
    type: Number,
    required: false,
  },
  taleId: {
    type: String,
    required: true,
  },
  authorId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

issueSchema.pre<IssueDocument>("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Export the Issue model based on the schema
const IssueModel = model<IssueDocument>("Issue", issueSchema);

export default IssueModel;
