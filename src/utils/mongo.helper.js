const { MongoClient } = require('mongodb');

const {
    MONGO_URL
} = process.env;

<<<<<<< HEAD
console.log('mongourl', MONGO_URL)

const returnMongoConnection = () => new Promise((resolve, reject) => {
    MongoClient.connect(MONGO_URL, { useNewUrlParser: true }, (err, client) => {
=======
const returnMongoConnection = () => new Promise((resolve, reject) => {
    MongoClient.connect(MONGO_URL, (err, client) => {
>>>>>>> b13ad2330c1cd7e5bcfabccb59fb80d6f5843426
        if (err) return reject(err);
        return resolve(client);
    });
});

module.exports = {
    returnMongoConnection
};
