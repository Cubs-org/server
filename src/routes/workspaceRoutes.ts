import { FastifyInstance } from "fastify";
import WorkspaceController from "../controllers/WorkspaceController";

const workspaceController = new WorkspaceController();

export async function workspaceRoute(app: FastifyInstance) {

    // Get a workspace
    app.get('/workspace/:userId', workspaceController.getWorkspace);

    // Get DatahubId
    app.get('/workspace/datahub', workspaceController.getDataHubId);
}