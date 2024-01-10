import { FastifyInstance } from "fastify";
import { findUserByEmail } from "../models/model.user.find";
import TestMessages from "./testMessages";
import getUser from "./userSocketControllers";

function socketController (fastify:FastifyInstance) {
  fastify.io.on('connection', socket => {

    TestMessages(socket);

    getUser(socket);

    socket.on('disconnect', () => console.log('disconnected'));
  });
};

export default socketController;