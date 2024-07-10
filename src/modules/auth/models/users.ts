import { Schema, model } from "mongoose";
import { User } from "../types";

const userSchema = new Schema<User>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
    unique: true,
    default: null,
  },
  githubId: {
    type: String,
    required: false,
    default: null,
  },
  password: {
    type: String,
    required: false,
    default: null,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  status: {
    type: String,
    required: false,
  },
  avatarUrl: {
    type: String,
    required: false,
    default: null,
  },
  authType: {
    type: String,
    enum: ["custom", "github"],
    default: "custom",
  },
});

const userModel = model<User>("Users", userSchema);

export default userModel;
