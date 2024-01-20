import { Schema, model } from "mongoose";
import { User } from "../types";

const userSchema = new Schema<User>({
  username: {
    type: String,
    required: true,
    unique: true,
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
  desired_anime_charecter: {
    type: String,
    required: false,
  },
  favourite_artist: {
    type: String,
    required: false,
  },
  favourite_manga: {
    type: String,
    required: false,
  },
  favourite_story: {
    type: String,
    required: false,
  },
  favourite_genre: {
    type: String,
    required: false,
  },
});

const userModel = model<User>("Users", userSchema);

export default userModel;
