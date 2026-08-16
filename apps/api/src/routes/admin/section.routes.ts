import { Router } from "express";
import { SectionController } from "../../controllers/section.controller";
import { asyncWrapper } from "../../utils/async-wrapper";
import { authenticate } from "../../middlewares/auth.middleware";
import { isAdmin } from "../../middlewares/admin.middleware";

const router = Router();
const sectionController = new SectionController();

router.get(
  "/sections",
  asyncWrapper(sectionController.index.bind(sectionController)),
);

router.get(
  "/sections/:id",
  asyncWrapper(sectionController.show.bind(sectionController)),
);

router.post(
  "/sections",
  authenticate,
  isAdmin,
  asyncWrapper(sectionController.store.bind(sectionController)),
);

router.put(
  "/sections/:id",
  authenticate,
  isAdmin,
  asyncWrapper(sectionController.update.bind(sectionController)),
);

router.delete(
  "/sections/:id",
  authenticate,
  isAdmin,
  asyncWrapper(sectionController.delete.bind(sectionController)),
);

export default router;
