import { HTTP_STATUS } from "../lib/http_status";
import { findUserByEmail } from "../models/model.user.find";
import { compare } from "bcrypt";

async function authenticateUser(req, reply) {
    const { email, password } = req.body;

    if (!email || !password) {
        return reply.status(HTTP_STATUS.BAD_REQUEST).send({ error: 'Request is missing data.' });
    }

    try {
        const user = await findUserByEmail(email);

        if (!user) {
            return reply.status(HTTP_STATUS.UNAUTHORIZED).send({ error: 'Invalid email.' });
        }

        const passwordMatch = await compare(password, user.password);

        if (passwordMatch) {
            return reply.status(HTTP_STATUS.OK).send({ user });
        } else {
            return reply.status(HTTP_STATUS.UNAUTHORIZED).send({ error: 'Invalid password.' });
        }
    } catch (error) {
        return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
    }
}

export default authenticateUser;
