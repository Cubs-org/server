import { FastifyInstance } from "fastify";

import authenticateUserByGoogle from "../controllers/controller.user.oauth_authenticate";
import authenticateUser from "../controllers/controller.user.authenticate";
import getUser from "../controllers/controller.user.get";
import registerUser from "../controllers/controller.user.register";

export async function userRoute(app: FastifyInstance) {

    // Create a new user
    app.post('/registerUser', registerUser);

    // Authenticate a user
    app.post('/authenticateUser', authenticateUser);
    app.post('/authenticateUser/oauth', authenticateUserByGoogle);

    // Get a user
    app.get('/getUser', getUser);
}