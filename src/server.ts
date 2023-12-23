import cors from '@fastify/cors';
import fastify from 'fastify';
import { appRoutes } from './routes';

require('dotenv').config();

const server = fastify();

const PORT = Number(process.env.PORT || 3000);

server.register(cors, {
    origin: '*',
    methods: '*',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
});

server.register(appRoutes)

server.get('/', (req, res) => {
    res.send({ hello: 'world' });
});

server.listen(
  { port: PORT, host: '0.0.0.0' }
).then(() => {
  console.log(`Server listening on port ${PORT}`);
})