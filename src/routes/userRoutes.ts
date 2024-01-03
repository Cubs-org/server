import { FastifyInstance } from "fastify";
import registerUser from "../controllers/user/register_user";

export async function userRoute(app: FastifyInstance) {

    app.post('/registerUser', registerUser);
}