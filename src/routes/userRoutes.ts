import { FastifyInstance } from "fastify";
import registerUser from "../controllers/user/register_user";
import authenticateUserByGoogle from "../controllers/user/authenticate_user_oauth";
import authenticateUser from "../controllers/user/authenticate_user";

export async function userRoute(app: FastifyInstance) {

    app.post('/registerUser', registerUser);

    app.post('/authenticateUser', authenticateUser);
    app.post('/authenticateUser/oauth', authenticateUserByGoogle);
}