import { HTTP_STATUS } from "../lib/http_status";
import { findUserByEmail } from "../models/model.user.find";
import fetchOAuth from "../utils/fetch_oath";

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
            return reply.status(HTTP_STATUS.CONFLICT).send({ error: 'User not found.' });
        }
    } catch (error) {
        console.error('Error:', error);
        return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
    }
}

export default authenticateUserByGoogle;
