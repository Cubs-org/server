import { FastifyInstance } from "fastify";

import PageController from "../controllers/PageController";
import PagePropertyController from "../controllers/PagePropertyController";

const pageController = new PageController();
const pagePropertyController = new PagePropertyController();

export async function pageRoute(app: FastifyInstance) {

    // Create a new page
    app.post('/createPage', pageController.create);

    // Get all pages from a user
    app.get('/pages/:userId', pageController.getAllPagesFromUser);

    // Update a page
    app.post('/updatePage/:pageId', pageController.update);

    // create a new page property
    app.post('/createPageProperty', pagePropertyController.create);

    // add a member to a page
    app.post('/addMember', pagePropertyController.addMember);
}