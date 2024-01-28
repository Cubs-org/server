import { FastifyInstance } from "fastify";
import UserController from "../controllers/UserController";

const userController = new UserController();

export async function userRoute(app: FastifyInstance) {

    // Create a new user
    app.post('/registerUser', userController.create);

    // Authenticate a user
    app.post('/authenticateUser', userController.authenticateUser);
    app.post('/authenticateUser/oauth', userController.authByGoogle);

    // Get a user
    app.get('/getUser', userController.get);

    // Delete a user
    app.delete('/deleteUser', userController.setUserTrashedStatus);
    app.delete('/deleteUser/permanently', userController.delete);
}