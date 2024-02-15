import express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: Record<string, any>;
      paginate?: { limit: number | string; offset: number | string };
    }
  }
}

export interface RequestParams {}

export interface ResponseBody {}

export interface RequestBody {
  vote_type: any;
}

export interface RequestQuery {
  taleId?: string;
  workflowId: string;
  limit?: string;
  offset?: string;
}
