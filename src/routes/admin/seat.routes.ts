import { Router } from "express";
import { SeatController } from "../../controllers/seat.controller";
import { asyncWrapper } from "../../utils/async-wrapper";
import { authenticate } from "../../middlewares/auth.middleware";
import { isAdmin } from "../../middlewares/admin.middleware";

const router = Router();
const seatController = new SeatController();

router.get(
  "/seats",
  authenticate,
  isAdmin,
  asyncWrapper(seatController.index.bind(seatController)),
);

router.get(
  "/seats/:id",
  authenticate,
  asyncWrapper(seatController.show.bind(seatController)),
);

router.post(
  "/seats",
  authenticate,
  isAdmin,
  asyncWrapper(seatController.store.bind(seatController)),
);

router.put(
  "/seats/:id",
  authenticate,
  isAdmin,
  asyncWrapper(seatController.update.bind(seatController)),
);

router.delete(
  "/seats/:id",
  authenticate,
  isAdmin,
  asyncWrapper(seatController.delete.bind(seatController)),
);

export default router;
