import { Server } from 'socket.io';
import UserSocket from './UserSocket';
import CalendarSocket from './CalendarSocket';
import DatahubSocket from './DatahubSocket';

const userSocket = new UserSocket();
const calendarSocket = new CalendarSocket();
const datahubSocket = new DatahubSocket();

function socketController(server: Server) {
    const io = server;

    io.on('connection', socket => {
        userSocket.update(socket);

        calendarSocket.createNewItem(socket);
        calendarSocket.getCalendarItems(socket);
        calendarSocket.updateItem(socket);
        calendarSocket.deleteItem(socket);

        datahubSocket.getItems(socket);
        datahubSocket.moveColumn(socket);
        datahubSocket.resizeColumn(socket);
        datahubSocket.createPage(socket);
        datahubSocket.createColumn(socket);
        socket.on('disconnect', () => console.log('Disconnected'));
    });
}

export default socketController;
