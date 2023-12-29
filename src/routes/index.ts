import { FastifyInstance } from "fastify";
import { userRoute } from "./userRoutes";

export async function appRoutes(app: FastifyInstance) {

    // userAuthentication route
    app.register(userRoute);
}