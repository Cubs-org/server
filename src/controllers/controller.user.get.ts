import { HTTP_STATUS } from "../lib/http_status";
import { findUserById } from "../models/model.user.find";

async function getUser(req, reply) {
    
    const { userId } = req.query;

    try {
        const user = await findUserById(userId);

        return reply.send({ user, status: HTTP_STATUS.OK });
    } catch (error) {
        return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error' });
    }
}

export default getUser;