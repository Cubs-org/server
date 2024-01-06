import { findUserById } from "../models/model.user.find";

async function getUser(req, reply) {
    
    const { idUser } = req.query;

    try {
        const user = await findUserById(idUser);

        return reply.code(200).send(user);
    } catch (error) {
        return reply.code(500).send({ error: 'Internal Server Error' });
    }
}

export default getUser;