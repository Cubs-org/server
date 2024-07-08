import { Router } from "express";
import PageController from "../controllers/PageController";
import PagePropertyController from "../controllers/PagePropertyController";

const router = Router();
const pageController = new PageController();
const pagePropertyController = new PagePropertyController();

router.post('/createPage', pageController.create.bind(pageController));
router.get('/getPages/:userId', pageController.getAllPagesFromUser.bind(pageController));
router.post('/updatePage/:pageId', pageController.update.bind(pageController));
router.post('/createPageProperty', pagePropertyController.create.bind(pagePropertyController));
router.post('/addMember', pagePropertyController.addMember.bind(pagePropertyController));
router.post('/createTool', pageController.createTool.bind(pageController));
router.get('/getTools', pageController.getToolsByPageId.bind(pageController));

export default router;