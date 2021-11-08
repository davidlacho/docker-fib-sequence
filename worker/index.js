// Connects to Redis
const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
const sub = redisClient.duplicate();

// Calculating Fib Value
const fib = (index) => index < 2 ? 1 : fib(index - 1) + fib(index - 2);

// Watching for values
sub.on('message', (channel, message) => {
    console.log(`calculating value for ${message}`)
    redisClient.hset('values', message, fib(parseInt(message)))
});

sub.subscribe('insert');

