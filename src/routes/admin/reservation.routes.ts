import { Router } from "express";
import { ReservationController } from "../../controllers/reservation.controller";
import { asyncWrapper } from "../../utils/async-wrapper";
import { authenticate } from "../../middlewares/auth.middleware";
import { isAdmin } from "../../middlewares/admin.middleware";

const router = Router();
const reservationController = new ReservationController();

router.get(
  "/reservations",
  authenticate,
  isAdmin,
  asyncWrapper(reservationController.index.bind(reservationController)),
);

router.get(
  "/reservations/:id",
  authenticate,
  asyncWrapper(reservationController.show.bind(reservationController)),
);

router.post(
  "/reservations",
  authenticate,
  asyncWrapper(reservationController.store.bind(reservationController)),
);

router.put(
  "/reservations/:id",
  authenticate,
  isAdmin,
  asyncWrapper(reservationController.update.bind(reservationController)),
);

router.delete(
  "/reservations/:id",
  authenticate,
  isAdmin,
  asyncWrapper(reservationController.delete.bind(reservationController)),
);

export default router;
