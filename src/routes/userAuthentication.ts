import { FastifyInstance } from "fastify";

import bcrypt from "bcrypt";

import { User } from "../types/userTypes";

import registerUser from "../controllers/user/registerUser";

export async function userAuthentication(app: FastifyInstance) {
    app.post('/registerUser', async (req, res) => {
        const { 
            name, 
            password,
            email,
            icon
        } = req.body as User;

        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        } else {
            hashedPassword = null;
        }

        try {
            const user = await registerUser({
                name,
                password: hashedPassword,
                email,
                icon
            });

            return res.send(user);
        } catch (error) {
            console.error(error);
            return res.send(error);
        }
    });
}