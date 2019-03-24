const { MongoClient } = require('mongodb');

const {
    MONGO_URL
} = process.env;

const DB_NAME = 'pubsub';
/**
 * todo:
 *  - mongo upsert
 *  - mogno cursor
*/

const returnMongoConnection = () => new Promise((resolve, reject) => {
    MongoClient.connect(MONGO_URL, (err, client) => {
        if (err) return reject(err);
        return resolve(client);
    });
});

/**
  * @function listItems
  * @returns {Promise} Array of all items in db
*/
const listItems = () => new Promise(async (resolve, reject) => {
    try {
        const client = await returnMongoConnection();
        const collection = client.db(DB_NAME).collection('subscribers');
        collection.find({}).toArray((err, res) => {
            client.close();
            if (err) {
                return reject(err);
            }
            return resolve(res);
        });
    } catch (err) {
        reject(err);
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

module.exports = {
    listItems,
    insertItem,
    findItem,
    removeItem
};
