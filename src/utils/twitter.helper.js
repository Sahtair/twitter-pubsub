const Twitter = require('twitter');

let twitterClient = null

module.exports = function() {
    if (twitterClient) {
        return twitterClient;
    }
    twitterClient = new Twitter({
        consumer_key: 'gbveCqmu3utJ0ouDQczVAG1S8',
        consumer_secret: 'KzcYNFrREq4cCbt2Eh9PJgVFFSLFKC0u4hK7oqUrjTZJCrzi8Z',
        access_token_key: '1100849368289210368-HzdCTig2P3o3Qjl7VlIsrEEjce1Hnw',
        access_token_secret: 'z1qSgEHUnEyf8ACC8fwq1ZReTTfQCXU1jByoKisiTR6Ho'
    });

    return twitterClient;
}();
