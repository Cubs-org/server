import { FastifyInstance } from "fastify";
import { userRoute } from "./user_authentication";

export async function appRoutes(app: FastifyInstance) {

    // userAuthentication route
    app.register(userRoute);
}