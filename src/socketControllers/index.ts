import { Server } from 'socket.io';
import CalendarSocket from './CalendarSocket';
import DatahubSocket from './DatahubSocket';
import WorkspaceSocket from './WorkspaceSocket';

const wkspSocket = new WorkspaceSocket();
const calendarSocket = new CalendarSocket();
const datahubSocket = new DatahubSocket();

function socketController(server: Server) {
    const io = server;

    io.on('connection', socket => {
        wkspSocket.getPagesByMemberId(socket);
        wkspSocket.tagsTest(socket);

        calendarSocket.createNewItem(socket);
        calendarSocket.getCalendarItems(socket);
        calendarSocket.updateItem(socket);
        calendarSocket.deleteItem(socket);

        datahubSocket.getPagesFromHub(socket);
        datahubSocket.moveColumn(socket);
        datahubSocket.resizeColumn(socket);
        datahubSocket.createPage(socket);
        datahubSocket.createColumn(socket);
        socket.on('disconnect', () => console.log('Disconnected'));
    });
}

export default socketController;
