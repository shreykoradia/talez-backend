import { ObjectId } from "mongodb";
import userModel from "../../auth/models/users";

interface profileUpdateHeader {
  email?: string;
  username?: string;
  status?: string;
}

interface userProfileCard {
  desired_anime_charecter: string;
  favourite_artist: string;
  favourite_manga: string;
  favourite_story: string;
  favourite_genre: string;
}

const updateProfileServices = async (
  userId: string,
  validatedUserData: profileUpdateHeader
) => {
  try {
    if (!validatedUserData) {
      return;
    }
    if (!ObjectId.isValid(userId)) {
      throw new Error("Invalid userId");
    }
    const existingUserWithUsername = await userModel.findOne({
      username: validatedUserData.username,
      _id: { $ne: new ObjectId(userId) },
    });

    const existingUserWithUserEmail = await userModel.findOne({
      username: validatedUserData.email,
      _id: { $ne: new ObjectId(userId) },
    });

    if (existingUserWithUsername) {
      throw new Error("Username Already Exists");
    }
    if (existingUserWithUserEmail) {
      throw new Error("Email Already Exists");
    }
    const updatedProfile = await userModel.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: validatedUserData },
      { new: true }
    );

    return updatedProfile;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

const updateProfileCard = async (
  userId: string,
  validatedUserData: userProfileCard
) => {
  try {
    if (!validatedUserData) return;

    if (!validatedUserData) {
      return;
    }
    if (!ObjectId.isValid(userId)) {
      throw new Error("Invalid userId");
    }
    const updatedProfileCard = await userModel.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: validatedUserData },
      { new: true }
    );

    return updatedProfileCard;
  } catch (error) {
    console.error("Error Updating Error:", error);
    throw error;
  }
};

export default { updateProfileServices, updateProfileCard };
