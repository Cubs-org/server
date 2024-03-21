import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import socketController from './socketControllers';
import router from './routes';
import { Server } from 'socket.io';

require('dotenv').config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(router);

socketController(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
