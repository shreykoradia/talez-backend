import axios from "axios";
import userModel from "../models/users";

const signInGitHubUser = async (code: string) => {
  try {
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    let user = await userModel.findOne({ githubId: userResponse.data.id });

    if (!user) {
      user = new userModel({
        githubToken: accessToken,
        githubId: userResponse.data.id,
        username: userResponse.data.login,
        email: userResponse.data.email || null,
        status: userResponse?.data?.bio || null,
        avatarUrl: userResponse?.data?.avatar_url,
        isVerified: true,
        authType: "github",
        password: null,
      });
      await user.save();
      return { user, accessToken };
    } else {
      return { user, accessToken };
    }
  } catch (error) {
    throw error;
  }
};

export default { signInGitHubUser };
