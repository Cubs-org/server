import { HTTP_STATUS } from "../lib/http_status";
import { findUserByEmail } from "../models/model.user.find";
import fetchOAuth from "../utils/fetch_oath";
import createUser from "../models/model.user.create";
import { RegisterUser } from "../types/userTypes";
import registerWorkspace from "./controller.workspace.create";

import jwt from 'jsonwebtoken';
import { updateUserById } from "../models/model.user.update";

async function authenticateUserByGoogle(req, reply) {
    const { access_token } = req.body;

    if (!access_token) {
        return reply.status(HTTP_STATUS.BAD_REQUEST).send({ error: 'Request is missing data.' });
    }

    try {
        const isValidToken = await fetchOAuth(access_token);

        if (!isValidToken) {
            return reply.status(HTTP_STATUS.BAD_REQUEST).send({ error: 'Invalid OAuthToken' });
        }

        const { email } = isValidToken;
        const user = await findUserByEmail(email);

        if (user) {
            return reply.status(HTTP_STATUS.OK).send({ user });
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
            } as RegisterUser);

            const workspace = await registerWorkspace(userCreated.id);
            const token = jwt.sign({ user, workspace }, "secret", { expiresIn: '72h' });

            const userUpdated = await updateUserById({
                id: userCreated.id,
                name: userCreated.name,
                email: userCreated.email,
                password: userCreated.password,
                icon: userCreated.icon,
                accessToken: token,
            });

            return reply.status(HTTP_STATUS.OK).send({ user: userUpdated });
        }
    } catch (error) {
        console.error('Error:', error);
        return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
    }
}

export default authenticateUserByGoogle;
