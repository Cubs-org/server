import DatahubModel from "../models/DatahubModel";
import UserModel from "../models/UserModel";
import WorkspaceModel from "../models/WorkspaceModel";

import { HTTP_STATUS } from "../lib/http_status";

class WorkspaceController {

    private wkspModel: WorkspaceModel;
    private userModel: UserModel;
    private hubModel: DatahubModel;

    constructor() {
        this.wkspModel = new WorkspaceModel();
        this.userModel = new UserModel();
        this.hubModel = new DatahubModel();
    }

    async getWorkspace(req, reply) {
    
        const { userId } = req.query;
    
        try {
            const user = await this.userModel.getById(userId);
    
            if (!user) {
                return reply.send({ error: 'User not found.', status: HTTP_STATUS.NOT_FOUND });
            }
    
            const workspace = await this.wkspModel.getByUserId(user.id);
    
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
            const dataHubId = await this.wkspModel.getDatabaseId(workspaceId);

            return reply.send({ dataHubId, status: HTTP_STATUS.OK });
        } catch (error) {
            console.error('Error:', error);
            return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
        }
    }

    async createNewPage(req, reply) {
        const { workspaceId, ownerId } = req.body;

        try {
            const newPage = await this.hubModel.createPageInHub(workspaceId, ownerId);

            return reply.send({ newPage, status: HTTP_STATUS.OK });
        } catch (error) {
            console.error('Error:', error);
            return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
        }
    }

    async createPageProperty(req, reply) {
        try {
            const { type } = req.body;
            const { hubId } = req.query;
            const pageProperty = await this.hubModel.createPropertyInHub(hubId, type);
            reply.send({ pageProperty, status: HTTP_STATUS.OK });
            
        } catch (error) {
            console.error(error);
        }
    }

    async getPagesByMemberId(req, reply) {

        const { memberId } = req.query;

        try {
            const pages = await this.wkspModel.getPagesByMemberId(memberId);

            return reply.send({ pages, status: HTTP_STATUS.OK });
        } catch (error) {
            console.error('Error:', error);
            return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
        }
    }
}

export default WorkspaceController;