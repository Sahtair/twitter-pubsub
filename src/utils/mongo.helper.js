const { MongoClient } = require('mongodb');

const {
    MONGO_URL
} = process.env;

const returnMongoConnection = () => MongoClient.connect(MONGO_URL, { useNewUrlParser: true })

module.exports = {
    returnMongoConnection
};
