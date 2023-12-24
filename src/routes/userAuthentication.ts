import { FastifyInstance } from "fastify";

import bcrypt from "bcrypt";

import { User } from "../types/userTypes";

import registerUser from "../controllers/user/registerUser";
import registerPlan from "../controllers/plan/registerPlan";

export async function userAuthentication(app: FastifyInstance) {
    app.post('/registerUser', async (req, res) => {
        const { 
            name, 
            password,
            email,
            icon
        } = req.body as User;

        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const plan = await registerPlan();

            const user = await registerUser({
                name,
                password: hashedPassword,
                email,
                icon,
                planId: plan.id
            });

            return res.send(user);
        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    });
}