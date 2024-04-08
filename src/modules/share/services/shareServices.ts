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

  const invitedUserExist = await userModel.findOne({
    email: userData?.email,
  });

  if (invitedUserExist) {
    const invitedUser = await shareModel.findOne({
      shared_to: invitedUserExist?.email,
    });

    if (invitedUser) {
      throw new Error("User Already Invited");
    }

    const invite = new shareModel({
      shared_to: userData?.email,
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

export default { inviteUser };
