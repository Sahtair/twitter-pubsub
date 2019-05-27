const { MongoClient } = require('mongodb');

const {
    MONGO_URL
} = process.env;

console.log('mongourl', MONGO_URL)

const returnMongoConnection = () => new Promise((resolve, reject) => {
    MongoClient.connect(MONGO_URL, { useNewUrlParser: true }, (err, client) => {
        if (err) return reject(err);
        return resolve(client);
    });
});

module.exports = {
    returnMongoConnection
};
