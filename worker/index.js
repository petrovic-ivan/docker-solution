/*jshint esversion: 6 */
const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
const sub = redisClient.duplicate();


/**
 * Calculate ficonacci based on index. It is intentionally implemented to be recursive!
 * @param {number} index 
 */
const fib = function(index) {
    if (index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
};

sub.on('message', (channel, message) => {
    redisClient.hset('values', message, fib(parseInt(message)));
});

sub.subscribe('insert');