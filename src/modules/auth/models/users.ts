import { Schema, model } from "mongoose";
import { User } from "../types";

const userSchema = new Schema<User>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    required: true,
  },
  status: {
    type: String,
    required: false,
  },
});

const userModel = model<User>("Users", userSchema);

export default userModel;
