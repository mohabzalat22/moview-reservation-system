import { Router } from "express";
import { ShowTimeController } from "../../controllers/showTime.controller";
import { asyncWrapper } from "../../utils/async-wrapper";
import { authenticate } from "../../middlewares/auth.middleware";
import { isAdmin } from "../../middlewares/admin.middleware";

const router = Router();
const showTimeController = new ShowTimeController();

router.get(
  "/showtimes",
  authenticate,
  isAdmin,
  asyncWrapper(showTimeController.index.bind(showTimeController)),
);

router.get(
  "/showtimes/:id",
  authenticate,
  asyncWrapper(showTimeController.show.bind(showTimeController)),
);

router.post(
  "/showtimes",
  authenticate,
  isAdmin,
  asyncWrapper(showTimeController.store.bind(showTimeController)),
);

router.put(
  "/showtimes/:id",
  authenticate,
  isAdmin,
  asyncWrapper(showTimeController.update.bind(showTimeController)),
);

router.delete(
  "/showtimes/:id",
  authenticate,
  isAdmin,
  asyncWrapper(showTimeController.delete.bind(showTimeController)),
);

export default router;
