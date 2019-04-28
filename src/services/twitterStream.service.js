const requestEvent = require('../utils/requestEvent.helper')
const twitterStream = require('../utils/twitter.helper');
const { setListCache } = require('../utils/cache.helper')
const { TWEETS } = require('./constants/cache.constants')

twitterStream.on('data', async (event) => {
    const { text: tweet } = event;
    // push tweet to tweets key in cache and send event to start making requests
    await setListCache(TWEETS, tweet)
    requestEvent.emit('start_requests')
});

twitterStream.on('error', (event) => {
    console.error(event);
});
