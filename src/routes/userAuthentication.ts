import { FastifyInstance } from "fastify";

export async function userAuthentication(app: FastifyInstance) {
    app.get('/registerUser', async (req, res) => {
        res.send('Hello new *user!');
    });
}