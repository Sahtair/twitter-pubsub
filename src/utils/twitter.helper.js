const Twitter = require('twitter');
const {
    CONSUMER_KEY,
    CONSUMER_SECRET,
    ACCESS_TOKEN_KEY,
    ACCESS_TOKEN_SECRET
} = require('../../config')

let twitterStream = null

module.exports = function() {
    if (!twitterStream) {
        const client = new Twitter({
            consumer_key: CONSUMER_KEY,
            consumer_secret: CONSUMER_SECRET,
            access_token_key: ACCESS_TOKEN_KEY,
            access_token_secret: ACCESS_TOKEN_SECRET
        });

        twitterStream = client.stream('statuses/filter', { track: 'javascript' });
    }

    return twitterStream;
}();
