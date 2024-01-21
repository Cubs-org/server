import { FastifyInstance } from "fastify";
import { userRoute } from "./userRoutes";
import { workspaceRoute } from "./workspaceRoutes";
import { pageRoute } from "./pageRoutes";

export async function appRoutes(app: FastifyInstance) {

    // user route
    app.register(userRoute);

    // workspace route
    app.register(workspaceRoute);

    // page route
    app.register(pageRoute);
}