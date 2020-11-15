var nats = require('node-nats-streaming');
var stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
});
stan.on('connect', function () {
    console.log('Connected to NATS services');
});
