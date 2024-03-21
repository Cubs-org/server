import { Router } from "express";
import PageController from "../controllers/PageController";
import PagePropertyController from "../controllers/PagePropertyController";

const router = Router();
const pageController = new PageController();
const pagePropertyController = new PagePropertyController();

router.post('/createPage', pageController.create);
router.get('/:userId', pageController.getAllPagesFromUser);
router.post('/updatePage/:pageId', pageController.update);
router.post('/createPageProperty', pagePropertyController.create);
router.post('/addMember', pagePropertyController.addMember);

export default router;