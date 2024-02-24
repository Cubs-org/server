import { FastifyInstance } from "fastify";
import UserSocket from "./UserSocket";
import CalendarSocket from "./CalendarSocket";

const userSocket = new UserSocket();
const calendarSocket = new CalendarSocket();

function socketController (fastify:FastifyInstance) {
  fastify.io.on('connection', socket => {

    userSocket.update(socket);

    calendarSocket.createNewItem(socket);
    calendarSocket.getCalendarItems(socket);

    socket.on('disconnect', () => console.log('disconnected'));
  });
};

export default socketController;