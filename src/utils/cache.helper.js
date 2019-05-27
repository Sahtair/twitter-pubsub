const redisClient = require('./redis.helper');
const { ...constants } = require('../services/constants/cache.constants');

redisClient.on('error', (err) => {
    console.error(`[${new Date()}] ${err}`);
});

/**
 * @function setCache
 * @description Sets data at key store
 *
 * @param {String} key
 * @param {String} data 
 * @returns {Promise}
 */
const setCache = (key, data) => new Promise((resolve, reject) => {
    return redisClient.set(key, data, (err) => {
        if (err) return reject(err);
        return resolve();
    });
});

/**
 * @function getCache
 * @description Retrieves data in the key store
 *
 * @param {String} key
 * @returns {Promise}
 */
const getCache = (key) => new Promise((resolve, reject) => {
    return redisClient.get(key, (err, res) => {
        if (err) return reject(err);
        return resolve(res);
    });
});

/**
 * @function setListCache
 * @description Pushes elements in redis list (from the right)
 *
 * @param {String} key 
 * @param {String|Array} data
 * @returns {Promise}
 */
const setListCache = (key, data) => new Promise((resolve, reject) => {
    return redisClient.rpush(key, data, (err) => {
        if (err) return reject(err);
        return resolve();
    });
});

/**
 * @function getListLength
 * @description Gets length of list at key. Useful for prefetching data
 *
 * @param {String} key
 * @returns {Promise}
 */
const getListLength = (key) => new Promise((resolve, reject) => {
    return redisClient.llen(key, (err, data) => {
        if (err) return reject(err);
        return resolve(Number(data));
    });
});

/**
 * @function popElement
 * @description Retrieves first element from list and shifts list left
 *
 * @param {String} key 
 * @returns {Promise}
 */
const popElement = (key) => new Promise((resolve, reject) => {
    return redisClient.lpop(key, (err, data) => {
        if (err) return reject(err);
        return resolve(data);
    });
});

/**
 * @function invalidateCache
 * @description Invalidate cache at key store
 * 
 * @param {String} key
 * @returns {Promise}
 */
const invalidateCache = (key) => new Promise((resolve, reject) => {
    return redisClient.del(key, (err) => {
        if (err) return reject(err);
        return resolve();
    });
});

/**
 * @function invalidateAll
 * @description Invalidates all stored keys from our application
 *
 * @returns {Promise}
 */
const invalidateAll = () => Promise.all(Object.entries(constants).map(([key, value]) => {
    return redisClient.del(value, (err) => {
        if (err) return Promise.reject(err);
        return Promise.resolve();
    });
}));

module.exports = {
    setCache,
    getCache,
    setListCache,
    getListLength,
    popElement,
    invalidateCache,
    invalidateAll
}
