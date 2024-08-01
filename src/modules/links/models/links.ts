import { model, Schema } from "mongoose";
import { link } from "../types";

const linksSchema = new Schema<link>({
  taleId: {
    type: String,
    required: true,
  },
  linkUrl: {
    type: String,
    required: true,
  },
  linkTitle: {
    type: String,
    reuired: false,
    default: null,
  },
  authorId: {
    type: String,
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const linkModel = model<link>("links", linksSchema);

export default linkModel;
