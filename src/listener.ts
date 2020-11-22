import * as nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TickedCreatedListener } from './events/ticket-created-listener';

console.clear();
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  new TickedCreatedListener(stan).listen();
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
console.log('Thanks');
