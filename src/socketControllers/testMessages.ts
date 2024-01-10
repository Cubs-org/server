import { Socket } from "socket.io";

export default function TestMessages(socket:Socket) {
    socket.on('message', message => {
        console.log(">> ", message);
        socket.broadcast.emit('getMessages', message);
    });
}