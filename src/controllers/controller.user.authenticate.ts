import { HTTP_STATUS } from "../lib/http_status";
import { findUserByEmail } from "../models/model.user.find";
import { compare } from "bcrypt";
import jwt from 'jsonwebtoken';

async function authenticateUser(req, reply) {
    const { email, password } = req.body;

    if (!email || !password) {
        return reply.send({ message: 'Request is missing data.', status: HTTP_STATUS.BAD_REQUEST });
    }

    try {
        const user = await findUserByEmail(email);

        if (!user) {
            return reply.send({ message: 'User does not exists.', status: HTTP_STATUS.UNAUTHORIZED });
        }

        const passwordMatch = await compare(password, user.password);

        if (passwordMatch) {
            const token = jwt.sign({ user }, "secret", { expiresIn: '72h' });
            return reply.send({ user, status: HTTP_STATUS.OK, token });
        } else {
            return reply.send({ message: 'Invalid password.', status: HTTP_STATUS.UNAUTHORIZED });
        }
    } catch (error) {
        return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error', status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
    }
}

export default authenticateUser;
