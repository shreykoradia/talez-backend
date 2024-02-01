export type upvote = {
  upvote_author_id: string;
  is_upVote: boolean;
};

export type downvote = {
  downvote_author_id: string;
  is_downVote: boolean;
};

export type reaction = {
  upvote: [upvote];
  downvote: [downvote];
};

export type feedback = {
  feedback: string;
  feedback_author_id: string;
  feedback_author_name: string;
  tale_id: string;
  created_at: Date;
  reaction: [reaction];
};
