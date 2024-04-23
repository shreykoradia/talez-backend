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
  if (!userId) return;
  if (!workflowId) return;

  const sharedBy = await userModel.findById(userId);

  // invited user exists inside talez app
  const invitedUserExist = await userModel.findOne({
    email: userData?.email,
  });

  if (invitedUserExist) {
    // if invitedUser is a part of workflow or document
    const invitedUser = await shareModel.findOne({
      shared_to: invitedUserExist?._id,
    });

    if (invitedUser) {
      throw new Error("User Already Invited");
    }

    const invite = new shareModel({
      shared_to: invitedUserExist?._id,
      role: userData?.role,
      shared_by: sharedBy?._id,
      workflow: workflowId,
    });
    await invite.save();

    return invite;
  } else {
    // Todo : Send the Email to the user sending him a invite link to the app and the workflow
    throw new Error("User Doesn't seems to be on Talez, Invite him on talez");
  }
};

const getUsersWithAccess = async (userId: string, workflowId: string) => {
  try {
    if (!userId) {
      throw Error("UserId not found");
    }
    if (!workflowId) {
      throw Error("Workflow Id not found");
    }
    const response = await shareModel.find({ workflow: workflowId });
    const enrichedResponse = await Promise.all(
      response.map(async (share) => {
        const user = await userModel.findById(share.shared_to);
        if (user) {
          const { shared_to, ...shareWithoutSharedTo } = share.toObject();
          return {
            ...shareWithoutSharedTo,
            shared_to: {
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
    throw Error("Something went wrong, Huh!");
  }
};

const updateAccess = async (
  userId: string,
  workflowId: string,
  userData: userDataProps
) => {
  try {
    if (!userId) {
      throw Error("UserId not found");
    }
    if (!workflowId) {
      throw Error("UserId not found");
    }
    const userDetails = await userModel.findOne({ email: userData?.email });
    await shareModel.updateOne(
      {
        shared_to: userDetails?._id,
        workflow: workflowId,
      },
      { $set: { role: userData?.role } }
    );
  } catch (error) {
    console.log(error);
    throw Error("Something Went Wrong Huh!");
  }
};

const removeAccess = async (
  workflowId: string,
  userData: { email: string }
) => {
  try {
    if (!workflowId) {
      throw Error("WorkflowId is Required");
    }
    const userDetails = await userModel.findOne({ email: userData?.email });
    const removedSharedUser = await shareModel.findOneAndDelete({
      shared_to: userDetails?._id,
      workflow: workflowId,
    });

    return removedSharedUser;
  } catch (error) {
    console.log(error);
    throw Error("Something Went Wrong!");
  }
};

export default { inviteUser, getUsersWithAccess, updateAccess, removeAccess };
