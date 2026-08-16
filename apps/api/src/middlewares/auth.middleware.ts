import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { ApiResponse } from "../utils/api-response";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const apiResponse = new ApiResponse();
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return apiResponse.unauthorized(res, "Authentication Required");
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return apiResponse.unauthorized(res, "Invalid authorization header");
  }

  try {
    const payload = verifyAccessToken(token);

    req.user = {
      id: payload.userId,
      role: payload.role,
    };

    next();
  } catch {
    return apiResponse.unauthorized(res, "Invalid or Expired Token");
  }
}
