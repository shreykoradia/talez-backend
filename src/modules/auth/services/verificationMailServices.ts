import userModel from "../models/users";

const markEmailAsVerified = async (userId: string) => {
  try {
    await userModel.updateOne({ _id: userId }, { $set: { isVerified: true } });
  } catch (error) {
    console.error("Error marking email as verified:", error);
    throw new Error("Error marking email as verified");
  }
};

export { markEmailAsVerified };
