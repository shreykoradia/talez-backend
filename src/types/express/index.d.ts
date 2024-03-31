import express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: Record<string, any>;
      paginate?: { limit: number; offset: number };
    }
  }
}

export interface RequestParams {}

export interface ResponseBody {}

export interface RequestBody {
  vote_type: any;
  feedbackId: string;
}

export interface RequestQuery {
  taleId?: string;
  workflowId?: string;
  feedbackId?: string;
  limit?: number;
  offset?: number;
}
