import { FastifyInstance } from "fastify";
import UserSocket from "./UserSocket";

const userSocket = new UserSocket();

function socketController (fastify:FastifyInstance) {
  fastify.io.on('connection', socket => {

    userSocket.update(socket);

    socket.on('disconnect', () => console.log('disconnected'));
  });
};

export default socketController;