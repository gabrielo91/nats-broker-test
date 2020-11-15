import * as nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable() // sends all events emitted in the past
    .setDurableName('accounting-service'); // keep track of all events that have got this subscription

  const subscription = stan.subscribe(
    'ticket:created',
    'listenerQueueGroup', // make sure tha all emitted events go to only one instance
    options
  );

  subscription.on('message', (msg: nats.Message) => {
    stan.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    const data = msg.getData();
    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()} with data ${data}`);
    }

    msg.ack();
  });
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
