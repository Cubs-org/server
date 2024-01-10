import Fastify from 'fastify';
import cors from '@fastify/cors';
import { appRoutes } from './routes';

import SocketIO from 'socket.io';
import socketController from './socketControllers';

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

    socketController(fastify);
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