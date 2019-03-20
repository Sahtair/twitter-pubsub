const MongoClient = require('mongodb').MongoClient;

const {
    MONGO_URL
} = process.env;

const DB_NAME = 'pubsub';

const listItems = () => new Promise((resolve, reject) => {
    MongoClient.connect(MONGO_URL, (err, client) => {
        if (err) {
            return reject(err);
        }
        const collection = client.db(DB_NAME).collection('subscribers');

        collection.find({}).toArray((err, res) => {
            if (err) {
                return reject(err);
            }
            client.close();
            return resolve(res);
        })
    });
});

const findItem = (item) => new Promise((resolve, reject) => {
    return resolve();
});

const removeItem = (item) => new Promise((resolve, reject) => {
    return resolve();
});

module.exports = {
    listItems,
    findItem,
    removeItem
};
