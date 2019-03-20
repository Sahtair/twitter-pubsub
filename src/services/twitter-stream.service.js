const twitterStream = require('../utils/twitter.helper');
const { getItems } = require('../utils/store.helper');

twitterStream.on('data', async (event) => {
    console.log(event);
    try {
        await Promise.all(getItems()
            .map(item => {
                return Promise.resolve()
            }))
    } catch (err) {
        console.error(err);
    }
});

twitterStream.on('error', (event) => {
    console.error(event);
});
