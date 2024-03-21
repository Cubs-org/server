import { HTTP_STATUS } from "../lib/http_status";
import DatahubModel from "../models/DatahubModel";
import UserModel from "../models/UserModel";

import WorkspaceModel from "../models/WorkspaceModel";

const workspaceModel = new WorkspaceModel();
const userModel = new UserModel();
const hubModel = new DatahubModel();

class WorkspaceController {

    async getWorkspace(req, reply) {
    
        const { userId } = req.params;
    
        try {
            const user = await userModel.getById(userId);
    
            if (!user) {
                return reply.send({ error: 'User not found.', status: HTTP_STATUS.NOT_FOUND });
            }
    
            const workspace = await workspaceModel.getByUserId(user.id);
    
            if (!workspace) {
                return reply.send({ error: 'Workspace not found.', status: HTTP_STATUS.NOT_FOUND });
            }
    
            return reply.send({ workspace, status: HTTP_STATUS.OK });
        } catch (error) {
            console.error('Error:', error);
            return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
        }
    }

    async getDataHubId(req, reply) {
        const { workspaceId } = req.query;

        try {
            const dataHubId = await workspaceModel.getDatabaseId(workspaceId);

            return reply.send({ dataHubId, status: HTTP_STATUS.OK });
        } catch (error) {
            console.error('Error:', error);
            return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
        }
    }

    async createNewPage(req, reply) {
        const { workspaceId, ownerId } = req.body;

        try {
            const newPage = await hubModel.createPageInHub(workspaceId, ownerId);

            return reply.send({ newPage, status: HTTP_STATUS.OK });
        } catch (error) {
            console.error('Error:', error);
            return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
        }
    }
}

export default WorkspaceController;