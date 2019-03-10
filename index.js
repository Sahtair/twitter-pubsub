const app = require('express')();
const Twitter = require('twitter');
const bodyParser = require('body-parser')
const { setCache, getCache, getKeys } = require('./src/utils/redis.helper');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const init = async () => {
    await setCache('la', 123)
    await setCache('la1', 1234)
    await setCache('la2', 12345)
    const keys = await getCache('la3');

    console.log(keys)
};

//init();

const client = new Twitter({
    consumer_key: 'gbveCqmu3utJ0ouDQczVAG1S8',
    consumer_secret: 'KzcYNFrREq4cCbt2Eh9PJgVFFSLFKC0u4hK7oqUrjTZJCrzi8Z',
    access_token_key: '1100849368289210368-HzdCTig2P3o3Qjl7VlIsrEEjce1Hnw',
    access_token_secret: 'z1qSgEHUnEyf8ACC8fwq1ZReTTfQCXU1jByoKisiTR6Ho'
});

const stream = client.stream('statuses/filter', { track: 'javascript' });

stream.on('data', (event) => {
    //console.log(event)
});

stream.on('error', (error) => {
    console.log(error)
})

app.get('/', async (req, res) => {    
    res.send('hello world this is it');
});

app.post('/subscribe', async (req, res) => {
    try {
        const { url } = req.body;

        console.log(url)

        const cachedValue = await getCache(url);

        if (cachedValue) {
            return res.status(302).send();
        }

        await setCache(url);

        return res.send();
    } catch (err) {
        console.log(err);

        return res.status(500).send(`Error subscribing to channel.`);
    }
});

app.listen(4040, () => {
    console.log(`listening on port: 4040`);
});
