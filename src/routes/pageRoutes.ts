import { Router } from "express";
import PageController from "../controllers/PageController";
import PagePropertyController from "../controllers/PagePropertyController";

const router = Router();
const pageController = new PageController();
const pagePropertyController = new PagePropertyController();

router.post('/createPage', pageController.create.bind(pageController));
router.get('/:userId', pageController.getAllPagesFromUser.bind(pageController));
router.post('/updatePage/:pageId', pageController.update.bind(pageController));
router.post('/createPageProperty', pagePropertyController.create.bind(pageController));
router.post('/addMember', pagePropertyController.addMember.bind(pageController));

export default router;