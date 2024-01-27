export type upvote = {
  upvote_author_id: string;
};

export type downvote = {
  downvote_author_id: string;
};

export type reaction = {
  upvote: [upvote];
  downvote: [downvote];
};

export type feedback = {
  feedback: string;
  feedback_author: string;
  created_at: Date;
  reaction: [reaction];
};

export type tale = {
  title: string;
  description: string;
  feedback: [feedback];
};
