import { ObjectId } from "mongoose";

export type Share = {
  workflow: ObjectId;
  sharedTo: string;
  sharedBy: ObjectId;
  role: string;
  sharedAt: Date | string;
};
