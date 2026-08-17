import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
const authController = new AuthController();

router.post("/auth/register", authController.register.bind(authController));
router.post("/auth/login", authController.login.bind(authController));
router.get("/auth/me", authenticate, authController.me.bind(authController));
router.post("/auth/refresh", authController.refresh.bind(authController));
router.post("/auth/logout", authController.logout.bind(authController));

export default router;
