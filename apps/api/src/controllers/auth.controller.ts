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
      
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return this.apiResponse.created(res, {
        user: result.user,
        accessToken: result.accessToken,
      });
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

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return this.apiResponse.success(res, {
        user: result.user,
        accessToken: result.accessToken,
      });
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
      const refreshToken = req.cookies?.refreshToken;

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

  async logout(req: Request, res: Response) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return this.apiResponse.success(res, null, "Logged out successfully");
  }
}
