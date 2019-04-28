const { returnMongoConnection } = require('../utils/mongo.helper')

const DB_NAME = 'pubsub';

/**
  * @function listItems
  * 
  * @param {Number} offset
  * @param {Number} limit
  *
  * @returns {Promise<Object>} Array of items filtered with offset and limit
*/
const listItems = (offset, limit) => new Promise(async (resolve, reject) => {
    try {
        const client = await returnMongoConnection();
        const collection = client.db(DB_NAME).collection('subscribers');
        console.time('start query')
        return collection.find({
            offset,
            limit
        }).toArray((err, data) => {
            console.timeEnd('start query')
            if (err) {
                client.close();
                return reject(err);
            }
            // counts all items. This is used for determening when to change current
            // tweet or to stop making requests.
            return collection.find().count((err, count) => {
                client.close()
                if (err) {
                    return reject(err)
                }
                return resolve({
                    data,
                    count 
                });

            })
        });
    } catch (err) {
        return reject(err);
    }
});

/**
 * @function insertItem
 * @param {String} url
 * @returns {Promise} Upserts item.
 */
const insertItem = (url) => new Promise(async (resolve, reject) => {
    try {
        const client = await returnMongoConnection();
        const collection = client.db(DB_NAME).collection('subscribers');
        collection.update({ url }, { url }, { upsert: true }, (err, response) => {
            client.close();
            if (err) return reject(err);
            resolve(response);
        })
    } catch (err) {
        return reject(err);
    }
});

/**
 * @deprecated
 * @function findItem
 * @param {String} item 
 * @returns {Promise} True if found item, false if not.
 */
const findItem = (item) => new Promise((resolve, reject) => {
    return resolve();
});

/**
 * @function removeItem
 * @param {String} url
 * @returns {Promise} True if removed item, false if not.
 */
const removeItem = (url) => new Promise(async (resolve, reject) => {
    try {
        const client = await returnMongoConnection();
        const collection = client.db(DB_NAME).collection('subscribers');
        collection.findOneAndDelete({ url }, (err, response) => {
            client.close();
            if (err) return reject(err);
            resolve(response);
        })
    } catch (err) {
        return reject(err);
    }
});

const countItems = () => new Promise(async (resolve, reject) => {
    try {
        const client = await returnMongoConnection();
        const collection = client.db(DB_NAME).collection('subscribers');
        collection.find({}).count((err, count) => {
            client.close();
            if (err) return reject(err);
            resolve(count);
        })
    } catch (err) {
        return reject(err);
    }
})

module.exports = {
    listItems,
    insertItem,
    findItem,
    removeItem,
    countItems
};
