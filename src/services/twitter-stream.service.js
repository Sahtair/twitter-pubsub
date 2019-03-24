const request = require('request-promise-native');

const twitterStream = require('../utils/twitter.helper');
const { listItems } = require('../utils/mongo.helper');

twitterStream.on('data', async (event) => {
    const tweet = event.text;
    console.log('tweet', tweet)
    try {
        const items = await listItems();
        console.log('items', items)
        await Promise.all(items.map(({ url }) => {
            return request({
                url,
                method: 'POST',
                json: true,
                body: {
                    tweet
                }
            }).catch(err => (console.warn(err), Promise.resolve()))
        }));
    } catch (err) {
        console.error('Error:', err);
    }
});

twitterStream.on('error', (event) => {
    console.error(event);
});
