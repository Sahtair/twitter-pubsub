const redis = require('redis')
const {
    REDIS_PORT
} = process.env;

let redisClient = null;

/**
 * @function
 * 
 * @description Returns redis connection. If a connection is not already made
 * it makes it and returns the connection.
 */
module.exports = function () {
    if (!redisClient) {
        redisClient = redis.createClient(REDIS_PORT)
    }
    return redisClient;
}()