const querystring = require('querystring');
const http = require('http');
const https = require('https');

https.globalAgent.maxSockets = 5;
http.globalAgent.maxSockets = 5;

const { parse: urlParser } = require('url');
const keepAliveAgent = new http.Agent({ keepAlive: true });

console.log(keepAliveAgent)

//const twitterStream = require('../utils/twitter.helper');
const { returnSubscriberCollection } = require('../utils/mongo.helper');

let count = 0;

const returnStream = (collection, limit, skip) => {
    if (skip) {
        return collection.find({}).skip(limit).stream()
    }
    return collection.find({}).limit(limit).stream()
};

let errors = [];

const makeRequest = (index, tweet) => {
    //console.time('request')
    //const { protocol = 'http', hotsname, port, path } = urlParser(url);
    const data = querystring.stringify({
        tweet
    });
    let req = null;
    const options = {
        port: 8081,
        path: '/api/' + index,
        method: 'POST',
        agent: keepAliveAgent,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data)
        }
    }
    // if ((protocol || '').indexOf('s') > -1) {
    //     req = https.request(options, (res) => {
    //         res.on('data', (d) => {
    //             process.stdout.write(d)
    //         })
    //     })
    // } else {
    //     req = http.request(options, (res) => {
    //         //console.timeEnd('request')
    //         res.on('data', (d) => {
    //             process.stdout.write(d)
    //         })
    //     })
    // }
    req = http.request(options, (res) => {
        //console.timeEnd('request')
        res.on('data', (d) => {
            process.stdout.write(d)
        })
    })
    req.on('error', (e) => {
        console.error(e);
    });
    req.write(data)
    req.end();
}

const prepareCollection = (collection) => (limit, skip) => new Promise((resolve, reject) => {
    try {
        const stream = returnStream(collection, limit, skip)
        const data = [];
        stream.on('data', ({ url }) => {
            count = count + 1;
            data.push(url)
        });

        stream.once('end', () => {
            resolve(data)
        });
    } catch (e) {
        console.log(e);
        reject(e);
    }
});

const init = async () => {
    const tweet = 'lala land';
    const collection = await returnSubscriberCollection()
    const total = await collection.count();

    console.log('total', total)
    const skip = Math.floor(total/2);
    
    const sendRequests = prepareCollection(collection);

    console.time('query')
    const promises = [
        sendRequests(skip, false, tweet),
        sendRequests((total - skip), true, tweet)
    ]

    const response = await Promise.all(promises)
    .then(res => [].concat(...res))
    .catch((e) => {
        console.log('error', e);
    });
    console.timeEnd('query')
    //console.time('requests')
    try {
        console.time('asdf');
        [...Array(10000)].map((item, index) => makeRequest(index));
        console.timeEnd('asdf');
        //setTimeout(() => {}, 200);
        //[...Array(10000)].map((item, index) => makeRequest(index));
        //makeRequest()
        //response.map((url) => makeRequest(url, tweet))
    } catch(e) {
        console.error(e)
    }
    console.log(errors)
    //console.timeEnd('requests')
}

init()

// twitterStream.on('data', async (event) => {
//     const { text: tweet } = event;
// });

// twitterStream.on('error', (event) => {
//     console.error(event);
// });
