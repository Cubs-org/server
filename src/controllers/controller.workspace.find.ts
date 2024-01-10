import { HTTP_STATUS } from "../lib/http_status";
import { findUserById } from "../models/model.user.find";
import { findWorkspaceByUserId } from "../models/model.workspace.find";

async function getWorkspace(req, reply) {
    
    const { userId } = req.params;

    try {
        const user = await findUserById(userId);

        if (!user) {
            return reply.send({ error: 'User not found.', status: HTTP_STATUS.NOT_FOUND });
        }

        const workspace = await findWorkspaceByUserId(user.id);

        if (!workspace) {
            return reply.send({ error: 'Workspace not found.', status: HTTP_STATUS.NOT_FOUND });
        }

        return reply.send({ workspace, status: HTTP_STATUS.OK });
    } catch (error) {
        console.error('Error:', error);
        return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
    }
}

export default getWorkspace;