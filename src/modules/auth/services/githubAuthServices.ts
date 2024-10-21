import axios from "axios";
import userModel from "../models/users";

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

const signInGitHubUser = async (
  code: string,
  decodedToken: DecodedToken | null
) => {
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

    let user;

    if (decodedToken && decodedToken?.userId) {
      user = await userModel.findById(decodedToken?.userId);
    } else {
      user = await userModel.findOne({ githubId: userResponse.data.id });
    }

    if (!user) {
      user = new userModel({
        githubToken: accessToken,
        githubId: userResponse.data.id,
        username: userResponse.data.login,
        email: userResponse.data.email || undefined,
        status: userResponse?.data?.bio || undefined,
        avatarUrl: userResponse?.data?.avatar_url,
        isVerified: true,
        authType: "github",
        password: null,
      });
      await user.save();
      return { user, accessToken };
    } else {
      user.githubToken = accessToken;
      user.githubId = userResponse.data.id;
      await user.save();
      return { user, accessToken };
    }
  } catch (error) {
    throw error;
  }
};

export default { signInGitHubUser };
