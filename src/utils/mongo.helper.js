const { MongoClient } = require('mongodb');

const {
    MONGO_URL
} = process.env;

const returnMongoConnection = () => new Promise((resolve, reject) => {
    MongoClient.connect(MONGO_URL, (err, client) => {
        if (err) return reject(err);
        return resolve(client);
    });
});

module.exports = {
    returnMongoConnection
};
