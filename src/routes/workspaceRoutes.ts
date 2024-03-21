import { Router } from "express";
import WorkspaceController from "../controllers/WorkspaceController";

const router = Router();
const workspaceController = new WorkspaceController();

// Defina as rotas do workspace
router.get('/:userId', workspaceController.getWorkspace);
router.get('/datahub', workspaceController.getDataHubId);
router.post('/page', workspaceController.createNewPage);

export default router;