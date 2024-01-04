import { findUserByEmail } from "../../models/user/find_user";
import { compare } from "bcrypt";

async function authenticateUser(req, res) {

    const { email, password } = req.body;

    if (email && password) {

        try {
            const user = await findUserByEmail(email);
            
            if (user) {
                if (compare(user.password, password))
                   return res.status(200).send({ user });
                else 
                   return res.status(400).send({ error: 'Invalid password.' });
           }
        } catch (err) {
            return res.status(400).send({ error: 'Invalid email.' });
        }


    } else return res.status(400).send({ error: 'Request is missing data.' });
}

export default authenticateUser;