import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { ApiResponse } from "../utils/api-response";

export class AuthController {
  private authService: AuthService;
  private apiResponse: ApiResponse;

  constructor() {
    this.authService = new AuthService();
    this.apiResponse = new ApiResponse();
  }
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      if (password.length < 8) {
        return this.apiResponse.badRequest(
          res,
          "Password must be at least 8 characters",
        );
      }

      const result = await this.authService.register(name, email, password);
      return this.apiResponse.created(res, result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed";
      return this.apiResponse.badRequest(res, message);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return this.apiResponse.badRequest(
          res,
          "Email and password are required",
        );
      }

      const result = await this.authService.login(email, password);

      return this.apiResponse.success(res, result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "authentication failed";
      return this.apiResponse.error(res, message);
    }
  }

  async me(req: Request, res: Response) {
    return this.apiResponse.success(res, {
      userId: req?.user?.id,
    });
  }

  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return this.apiResponse.unauthorized(res, "Refresh token is required");
      }

      const result = await this.authService.refresh(refreshToken);

      return this.apiResponse.success(
        res,
        result,
        "Access token refreshed successfully",
      );
    } catch (error) {
      return this.apiResponse.unauthorized(
        res,
        "Invalid or expired refresh token",
      );
    }
  }
}
