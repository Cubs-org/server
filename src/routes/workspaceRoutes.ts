import { FastifyInstance } from "fastify";
import getWorkspace from "../controllers/controller.workspace.find";

export async function workspaceRoute(app: FastifyInstance) {

    // Get a workspace
    app.get('/workspace/:userId', getWorkspace);
}