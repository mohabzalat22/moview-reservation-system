import { Router } from "express";
import { MovieController } from "../../controllers/movie.controller";
import { asyncWrapper } from "../../utils/async-wrapper";
import { authenticate } from "../../middlewares/auth.middleware";
import { isAdmin } from "../../middlewares/admin.middleware";
const router = Router();
const movieController = new MovieController();

router.get(
  "/movies",
  authenticate,
  isAdmin,
  asyncWrapper(movieController.index.bind(movieController)),
);

router.get(
  "/movies/:id",
  authenticate,
  asyncWrapper(movieController.show.bind(movieController)),
);

router.post(
  "/movies",
  asyncWrapper(movieController.store.bind(movieController)),
);

router.put(
  "/movies/:id",
  asyncWrapper(movieController.update.bind(movieController)),
);

router.delete(
  "/movies/:id",
  asyncWrapper(movieController.delete.bind(movieController)),
);

export default router;
