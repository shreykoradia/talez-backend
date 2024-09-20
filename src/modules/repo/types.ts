export interface RepositorySchema {
  workflowId: string;
  repoId: string;
  repoName: string;
  repoOwner: string;
  repoGitUrl: string;
  repoCloneUrl: string;
  repoSSHUrl: string;
  repoOpenIssueCount: number;
}

export interface RepositoryPayload {
  workflowId: string;
  repo_id: string;
  repo_name: string;
  repo_owner_name: string;
  repo_git_url: string;
  repo_clone_url: string;
  repo_ssh_url: string;
  repoOpenIssueCount: string;
}
