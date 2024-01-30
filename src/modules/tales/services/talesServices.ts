import { ObjectId } from "mongodb";
import { tale } from "../types";
import userModel from "../../auth/models/users";
import talesModel from "../models/tales";

const createTales = async (userId: string, validatedData: tale) => {
  try {
    if (!validatedData) {
      return;
    }
    if (!ObjectId.isValid(userId)) {
      throw new Error("Invalid userId");
    }
    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    //extracting author for tales
    const authorId = userId.toString();
    const authorName = user?.username;

    const newTale = new talesModel({
      ...validatedData,
      authorId,
      authorName,
    });

    await newTale.save();
    return newTale;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};

export default { createTales };
