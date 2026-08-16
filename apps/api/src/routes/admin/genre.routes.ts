import { Router } from "express";
import { GenreController } from "../../controllers/genre.controller";
import { asyncWrapper } from "../../utils/async-wrapper";
import { authenticate } from "../../middlewares/auth.middleware";
import { isAdmin } from "../../middlewares/admin.middleware";
const router = Router();
const genreController = new GenreController();

router.get(
  "/genres",
  authenticate,
  isAdmin,
  asyncWrapper(genreController.index.bind(genreController)),
);

router.get(
  "/genres/:id",
  authenticate,
  asyncWrapper(genreController.show.bind(genreController)),
);

router.post(
  "/genres",
  asyncWrapper(genreController.store.bind(genreController)),
);

router.put(
  "/genres/:id",
  asyncWrapper(genreController.update.bind(genreController)),
);

router.delete(
  "/genres/:id",
  asyncWrapper(genreController.delete.bind(genreController)),
);

export default router;
