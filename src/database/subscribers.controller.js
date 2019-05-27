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
const listItems = async (offset, limit) => {
    try {
        let client
        let collection
        do {
            try {
                client = await returnMongoConnection();
                collection = client.db(DB_NAME).collection('subscribers');
            } catch (e) {
            }
        } while(!collection)

        let data
        let count
        try {
            ([
                data,
                count
            ] = await Promise.all([
                collection
                    .find()
                    .limit(limit)
                    .skip(offset)
                    .project({
                        _id: 0,
                        url: 1
                    })
                    .toArray(),
                collection.find().count()
            ]));
        } catch (e) {
            console.log(e);
            throw err;
        }
        client.close();
        return {
            data: data.map(({ url }) => url),
            count
        };
    } catch (err) {
        throw err;
    }
};

/**
 * @function insertItem
 * @param {String} url
 * @returns {Promise} Upserts item.
 */
const insertItem = async (url) => {
    const client = await returnMongoConnection();
    const collection = client.db(DB_NAME).collection('subscribers');
    return collection.update({ url }, { url }, { upsert: true });
};

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
const removeItem = async (url) => {
    const client = await returnMongoConnection();
    const collection = client.db(DB_NAME).collection('subscribers');
    return collection.findOneAndDelete({ url });
};

const countItems = async () => {
    const client = await returnMongoConnection();
    const collection = client.db(DB_NAME).collection('subscribers');
    return collection.find({}).count();
};

module.exports = {
    listItems,
    insertItem,
    findItem,
    removeItem,
    countItems
};
