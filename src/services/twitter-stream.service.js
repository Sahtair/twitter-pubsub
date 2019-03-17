const twitterStream = require('../utils/twitter.helper');
const { getItems } = require('../utils/store.helper');

twitterStream.on('data', (event) => {
    console.log(event);
});

twitterStream.on('error', (event) => {
    console.error(event);
});
