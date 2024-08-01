export interface link {
  taleId: string;
  linkUrl: string;
  linkTitle: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
}

export interface linkRequest {
  linkUrl: string;
  linkTitle: string;
}
