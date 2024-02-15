import { NextFunction, Response } from "express";

export const paginateMiddleWare = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  // Check if paginate object exists
  if (!req.paginate) {
    req.paginate = {};
  }

  // default limit
  const defaultLimit = 10;
  const defaultOffset = 0;

  // Parse limit and offset from query parameters
  const limit =
    (parseInt(req.query.limit) as number | undefined) || defaultLimit;
  const offset =
    (parseInt(req.query.offset) as number | undefined) || defaultOffset;
  req.pagination = { limit, offset };

  next();
};
