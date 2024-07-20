import mongoose, { Schema, model } from "mongoose";
import { Share } from "../types";

const shareSchema = new Schema<Share>({
  workflow: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "workFlow",
    required: true,
  },
  sharedTo: {
    type: String,
    required: true,
  },
  sharedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  role: {
    type: String,
    enum: ["can_edit", "can_view", "full_access"],
    required: true,
  },
  sharedAt: {
    type: Date,
    default: Date.now,
  },
});

// Define a virtual field to populate the shared_to_user field
shareSchema.virtual("shared_to_user", {
  ref: "Users",
  localField: "shared_to",
  foreignField: "email",
  justOne: true,
});

const shareModel = model<Share>("share", shareSchema);

export default shareModel;
