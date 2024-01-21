import Fastify from 'fastify';
import cors from '@fastify/cors';
import { appRoutes } from './routes';

import SocketIO from 'socket.io';
import socketController from './socketControllers';

// Load environment variables
require('dotenv').config();

// Create Fastify instance
const fastify = Fastify();

// Configure Fastify instance
const HOST = process.env.HOST || '0.0.0.0';
const PORT = Number(process.env.PORT || 3000);

// Configure CORS
fastify.register(cors, {
    origin: '*',
    methods: '*',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
});

// Configure Socket.io
fastify.register(require('fastify-socket.io'), {
  cors: {
    origin: '*',
    methods: '*',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }
});

// Routes
fastify.register(appRoutes)

// SocketControllers 
fastify.ready(err => {
  try {
    if (err) throw err;

    socketController(fastify);
  } catch (err) {
    console.error(err);
  }
});

// Start server
fastify.listen({ 
  port: PORT, 
  host: HOST 
}).then(() => console.log(`Server is listening at http://localhost:${PORT}`));

declare module 'fastify' {
    interface FastifyInstance {
        io: SocketIO.Server;
    }
}