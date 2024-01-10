import { HTTP_STATUS } from "../lib/http_status";
import { findUserByEmail } from "../models/model.user.find";
import fetchOAuth from "../utils/fetch_oath";
import createUser from "../models/model.user.create";
import { UserDB } from "../types/userTypes";
import registerWorkspace from "./controller.workspace.create";

import jwt from 'jsonwebtoken';

async function authenticateUserByGoogle(req, reply) {
    const { access_token } = req.body;

    if (!access_token) {
        return reply.status(HTTP_STATUS.BAD_REQUEST).send({ error: 'Request is missing data.' });
    }

    try {
        const isValidToken = await fetchOAuth(access_token);

        if (!isValidToken) {
            return reply.send({ error: 'Invalid OAuthToken', status: HTTP_STATUS.BAD_REQUEST });
        }

        const { email } = isValidToken;
        const user = await findUserByEmail(email);

        if (user) {
            const token = jwt.sign({ user }, "secret", { expiresIn: '72h' });
            return reply.send({ user, token, status: HTTP_STATUS.OK });
        } else {
            // return reply.status(HTTP_STATUS.CONFLICT).send({ error: 'User not found.' });

            const { name, email, picture } = isValidToken;
            const userCreated = await createUser({
                name,
                email,
                icon: picture,
                status: 'active',
                accountType: 'free',
                planType: 'perMonth',
                paymentType: 'creditCard'
            } as UserDB);

            const workspace = await registerWorkspace(userCreated.id);
            const token = jwt.sign({ user }, "secret", { expiresIn: '72h' });

            return reply.send({ user: userCreated, token: token, status: HTTP_STATUS.OK });
        }
    } catch (error) {
        console.error('Error:', error);
        return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
    }
}

export default authenticateUserByGoogle;
