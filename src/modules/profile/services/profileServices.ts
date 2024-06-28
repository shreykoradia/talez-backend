import { ObjectId } from "mongodb";
import userModel from "../../auth/models/users";
import { HttpException } from "../../../shared/exception/exception";
import { HTTP_RESPONSE_CODE } from "../../../shared/constants";

interface profileUpdateHeader {
  email?: string;
  username?: string;
  status?: string;
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
      throw new HttpException(HTTP_RESPONSE_CODE.BAD_REQUEST, "Invalid userId");
    }

    const existingUserWithUserEmail = await userModel.findOne({
      username: validatedUserData.email,
      _id: { $ne: new ObjectId(userId) },
    });

    if (existingUserWithUserEmail) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.CONFLICT,
        "Email already taken"
      );
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

export default { updateProfileServices };
