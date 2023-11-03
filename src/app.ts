require('./config');

const express = require('express');
const { createServer } = require('http');

const { Server } = require('socket.io');

const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 3000;

const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat message', (msg:string) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

})

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});