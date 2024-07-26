import { Server } from 'socket.io';
import CalendarSocket from './CalendarSocket';
import DatahubSocket from './DatahubSocket';
import WorkspaceSocket from './WorkspaceSocket';

function socketController(server: Server) {
    const io = server;
    const datahubSocket = new DatahubSocket(io);
    const calendarSocket = new CalendarSocket();
    const wkspSocket = new WorkspaceSocket();

    io.on('connection', socket => {
        wkspSocket.getPagesByMemberId(socket);
        wkspSocket.tagsTest(socket);

        calendarSocket.createNewItem(socket);
        // calendarSocket.getCalendarItems(socket);
        calendarSocket.getOwnedItems(socket);
        calendarSocket.updateItem(socket);
        calendarSocket.deleteItem(socket);

        datahubSocket.getPagesFromHub(socket);
        datahubSocket.moveColumn(socket);
        datahubSocket.resizeColumn(socket);
        datahubSocket.createPage(socket);
        datahubSocket.createColumn(socket);

        // Handle joining and leaving rooms
        socket.on('joinRoom', (room: string) => {
            datahubSocket.joinRoom(socket, room);
        });

        socket.on('leaveRoom', (room: string) => {
            datahubSocket.leaveRoom(socket, room);
        });

        socket.on('disconnect', () => console.log('Disconnected'));
    });
}

export default socketController;