import Fastify from 'fastify';
import cors from '@fastify/cors';
import { appRoutes } from './routes';

import SocketIO from 'socket.io';

require('dotenv').config();

const fastify = Fastify();

const HOST = process.env.HOST || '0.0.0.0';
const PORT = Number(process.env.PORT || 3000);

fastify.register(cors, {
    origin: '*',
    methods: '*',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
});

fastify.register(require('fastify-socket.io'), {
  cors: {
    origin: '*',
    methods: '*',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }
});

fastify.register(appRoutes)

fastify.ready(err => {
  try {
    if (err) throw err;

    fastify.io.on('connection', socket => {

      // Listen for a new user joining and broadcast a notice to all users
      socket.on('message', message => {
        console.log(">> ", message);
        socket.broadcast.emit('message', message);
      });

      socket.on('disconnect', () => console.log('disconnected'));
    });
  } catch (err) {
    console.error(err);
  }
});

fastify.listen({ 
  port: PORT, 
  host: HOST 
}).then(() => console.log(`Server is listening at http://${HOST}:${PORT}`));

declare module 'fastify' {
    interface FastifyInstance {
        io: SocketIO.Server;
    }
}