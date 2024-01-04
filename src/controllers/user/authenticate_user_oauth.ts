import { findUserByEmail } from "../../models/user/find_user";
import fetchOAuth from "./fetch_oath";

async function authenticateUserByGoogle(req, res) {

    const { access_token } = req.body;

    if(access_token) {
        const isValidToken = await fetchOAuth(access_token);
        
        if(isValidToken) {
            
            const { email } = isValidToken;

            try {
                const user = await findUserByEmail(email);

                if(user) {
                    return res.status(200).send({ user });
                } else return res.status(201).send({ error: 'User not found.' });
            } catch(err) {
                return res.status(500).send({ error: err });
            }

        } else return res.status(400).send({ error: 'Invalid OAuthToken' });

    } else return res.status(400).send({ error: 'Request is missing data.' });
}

export default authenticateUserByGoogle;