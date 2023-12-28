import { FastifyInstance } from "fastify";
import UserController from "../controllers/user/register_user";

const userController = new UserController();

export async function userRoute(app: FastifyInstance) {

    app.post('/registerUser', userController.registerUser);
}