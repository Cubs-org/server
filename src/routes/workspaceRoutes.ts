import { Router } from "express";
import WorkspaceController from "../controllers/WorkspaceController";

const router = Router();
const workspaceController = new WorkspaceController();

// Defina as rotas do workspace
router.get('/', workspaceController.getWorkspace.bind(workspaceController));
router.get('/datahub', workspaceController.getDataHubId.bind(workspaceController));
router.post('/page', workspaceController.createNewPage.bind(workspaceController));
router.post('/page/property', workspaceController.createPageProperty.bind(workspaceController));
router.get('/pagesForMember', workspaceController.getPagesByMemberId.bind(workspaceController));

export default router;