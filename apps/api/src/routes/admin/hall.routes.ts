import { Router } from "express";
import { HallController } from "../../controllers/hall.controller";
import { asyncWrapper } from "../../utils/async-wrapper";
import { authenticate } from "../../middlewares/auth.middleware";
import { isAdmin } from "../../middlewares/admin.middleware";

const router = Router();
const hallController = new HallController();

router.get(
  "/halls",
  asyncWrapper(hallController.index.bind(hallController)),
);

router.get(
  "/halls/:id",
  asyncWrapper(hallController.show.bind(hallController)),
);

router.post(
  "/halls",
  authenticate,
  isAdmin,
  asyncWrapper(hallController.store.bind(hallController)),
);

router.put(
  "/halls/:id",
  authenticate,
  isAdmin,
  asyncWrapper(hallController.update.bind(hallController)),
);

router.delete(
  "/halls/:id",
  authenticate,
  isAdmin,
  asyncWrapper(hallController.delete.bind(hallController)),
);

export default router;
