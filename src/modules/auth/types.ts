export interface User {
  username: string;
  email: string;
  githubId: string;
  githubToken: string;
  password: string;
  isVerified: boolean;
  status: string;
  avatarUrl: string;
  authType: string;
}
