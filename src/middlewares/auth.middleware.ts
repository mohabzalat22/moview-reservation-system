import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { ApiResponse } from "../utils/api-response";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const apiResponse = new ApiResponse();
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return apiResponse.unauthorized(res, "authentication Required");
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return;
  }

  try {
    const payload = verifyToken(token);

    req.user = {
      id: payload.userId,
    };

    next();
  } catch {
    return apiResponse.unauthorized(res, "Invalid or Expired Token");
  }
}
