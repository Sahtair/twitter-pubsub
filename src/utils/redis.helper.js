const redis = require('redis');

let redisInstance = null;

const connect = () => {
    try {
        if (redisInstance) {
            return redisInstance;
        }
        redisInstance = redis.createClient(
            process.env.REDIS_PORT || 6379,
            process.env.REDIS_HOST || 'localhost'
        );
        return redisInstance;
    } catch (err) {
        console.log(`Redis errro: ${err}`);
    }
};

const setCache = (key, value) => new Promise((resolve, reject) => {
    try {
        connect().set(key, value, (err) => err ? reject(err) : resolve());
    } catch (err) {
        console.log(`Redis error: ${err}`);
        reject(err);
    }
});

const getCache = (key) => new Promise((resolve, reject) => {
    try {
        connect().get(key, (err, val) => err ? reject(err) : resolve(val));
    } catch (err) {
        console.log(`Redis error: ${err}`);
        reject(err);
    }
});

const getKeys = (key) => new Promise((resolve, reject) => {
    try {
        connect().keys(key, (err, keys) => err ? reject(err) : resolve(keys));
    } catch (err) {
        console.log(`Redis error: ${err}`);
        reject(err);
    }
});

module.exports = {
    connect,
    setCache,
    getCache,
    getKeys
};
