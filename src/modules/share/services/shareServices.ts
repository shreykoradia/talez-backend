import { HTTP_RESPONSE_CODE } from "../../../shared/constants";
import { HttpException } from "../../../shared/exception/exception";
import userModel from "../../auth/models/users";
import shareModel from "../models/share";

interface userDataProps {
  email: string;
  role: string;
}

const inviteUser = async (
  workflowId: string,
  userId: string,
  userData: userDataProps
) => {
  if (!userId) {
    throw new HttpException(HTTP_RESPONSE_CODE.BAD_REQUEST, "User Id required");
  }
  if (!workflowId) {
    throw new HttpException(
      HTTP_RESPONSE_CODE.BAD_REQUEST,
      "Workflow Id required"
    );
  }

  const sharedBy = await userModel.findById(userId);

  // invited user exists inside talez app
  const invitedUserExist = await userModel.findOne({
    email: userData?.email,
  });

  if (invitedUserExist) {
    // if invitedUser is a part of workflow or document
    const invitedUser = await shareModel.findOne({
      sharedTo: invitedUserExist?._id,
    });

    if (invitedUser) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.CONFLICT,
        "User Already Invited"
      );
    }

    const invite = new shareModel({
      sharedTo: invitedUserExist?._id,
      role: userData?.role,
      sharedBy: sharedBy?._id,
      workflow: workflowId,
    });
    await invite.save();

    return invite;
  } else {
    // Todo : Send the Email to the user sending him a invite link to the app and the workflow
    throw new HttpException(
      HTTP_RESPONSE_CODE.BAD_REQUEST,
      "User Doesn't seems to be on Talez, Invite him on talez"
    );
  }
};

const getUsersWithAccess = async (userId: string, workflowId: string) => {
  try {
    if (!userId) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        "UserId required"
      );
    }
    if (!workflowId) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        "Workflow Id required"
      );
    }
    const response = await shareModel.find({ workflow: workflowId });
    const enrichedResponse = await Promise.all(
      response.map(async (share) => {
        const user = await userModel.findById(share.sharedTo);
        if (user) {
          const { sharedTo, ...shareWithoutSharedTo } = share.toObject();
          return {
            ...shareWithoutSharedTo,
            sharedTo: {
              _id: user._id,
              username: user.username,
              email: user.email,
            },
          };
        }
        return share;
      })
    );
    return enrichedResponse;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateAccess = async (
  userId: string,
  workflowId: string,
  userData: userDataProps
) => {
  try {
    if (!userId) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        "UserId required"
      );
    }
    if (!workflowId) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        "Workflow Id required"
      );
    }
    const userDetails = await userModel.findOne({ email: userData?.email });
    await shareModel.updateOne(
      {
        sharedTo: userDetails?._id,
        workflow: workflowId,
      },
      { $set: { role: userData?.role } }
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const removeAccess = async (
  workflowId: string,
  userData: { email: string }
) => {
  try {
    if (!workflowId) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        "Workflow Id required"
      );
    }
    const userDetails = await userModel.findOne({ email: userData?.email });
    const removedSharedUser = await shareModel.findOneAndDelete({
      sharedTo: userDetails?._id,
      workflow: workflowId,
    });

    return removedSharedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default { inviteUser, getUsersWithAccess, updateAccess, removeAccess };
