import type { Response } from "express";

export class ApiResponse {
  success = <T>(
    res: Response,
    data: T,
    message = "Request successful",
    statusCode = 200,
  ) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  };

  created = <T>(
    res: Response,
    data: T,
    message = "Resource created successfully",
  ) => {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  };

  deleted = (res: Response, message = "Resource deleted successfully") => {
    return res.status(200).json({
      success: true,
      message,
    });
  };

  updated = <T>(
    res: Response,
    data: T,
    message = "Resource updated successfully",
  ) => {
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  };

  error = (
    res: Response,
    message = "Something went wrong",
    statusCode = 500,
    errors?: Record<string, string>,
  ) => {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(errors && { errors }),
    });
  };

  badRequest = (
    res: Response,
    message = "Bad request",
    errors?: Record<string, string>,
  ) => {
    return this.error(res, message, 400, errors);
  };

  unauthorized = (res: Response, message = "Unauthorized") => {
    return this.error(res, message, 401);
  };

  forbidden = (res: Response, message = "Forbidden") => {
    return this.error(res, message, 403);
  };

  notFound = (res: Response, message = "Resource not found") => {
    return this.error(res, message, 404);
  };

  conflict = (res: Response, message = "Resource already exists") => {
    return this.error(res, message, 409);
  };

  validationError = (
    res: Response,
    errors: Record<string, string>,
    message = "Validation failed",
  ) => {
    return this.error(res, message, 422, errors);
  };

  serverError = (res: Response, message = "Internal server error") => {
    return this.error(res, message, 500);
  };
}
