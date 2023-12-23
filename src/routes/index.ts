import { FastifyInstance } from "fastify";
import { userAuthentication } from "./userAuthentication";

export async function appRoutes(app: FastifyInstance) {

    // userAuthentication route
    app.register(userAuthentication)
}