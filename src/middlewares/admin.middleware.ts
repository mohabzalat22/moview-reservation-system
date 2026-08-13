import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/api-response";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const apiResponse = new ApiResponse();
  if (!req.user) {
    return apiResponse.unauthorized(res, "Authentication required");
  }

  if (req.user.role !== "ADMIN") {
    return apiResponse.forbidden(res, "Admin access required");
  }

  next();
};
