const app = require('express')();
const http = require('http').Server(app);
var Twitter = require('twitter');

const client = new Twitter({
    consumer_key: 'gbveCqmu3utJ0ouDQczVAG1S8',
    consumer_secret: 'KzcYNFrREq4cCbt2Eh9PJgVFFSLFKC0u4hK7oqUrjTZJCrzi8Z',
    access_token_key: '1100849368289210368-HzdCTig2P3o3Qjl7VlIsrEEjce1Hnw',
    access_token_secret: 'z1qSgEHUnEyf8ACC8fwq1ZReTTfQCXU1jByoKisiTR6Ho'
});

const stream = client.stream('statuses/filter', {track: 'javascript'});

stream.on('data', (event) => {
    console.log(event)
});

stream.on('error', (error) => {
    console.log(error)
})

app.get('/', (req, res) => {
    res.send('hello world this is it');
});

http.listen(4040, () => {
    console.log(`listening on port: 4040`);
});
