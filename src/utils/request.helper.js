const querystring = require('querystring');
const http = require('http');
// const https = require('https');
const { parse: urlParser } = require('url');
<<<<<<< HEAD
const requestEvent = require('../utils/requestEvent.helper')

// number of currently opened requests
let requestCount = 0;
=======

// number of currently opened requests
const requestCount = 0;
>>>>>>> b13ad2330c1cd7e5bcfabccb59fb80d6f5843426

/**
 * @function makeRequest
 *
 * @param {String} url 
 * @param {String} tweet 
 */
const makeRequest = (url, tweet) => {
    const { protocol = 'http', hostname, port, path } = urlParser(url);
<<<<<<< HEAD
=======
    //console.log(protocol, hostname, port, path)
>>>>>>> b13ad2330c1cd7e5bcfabccb59fb80d6f5843426
    const data = querystring.stringify({
        tweet
    });
    let req = null;
    const options = {
        port,
        path,
        hostname,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
<<<<<<< HEAD
            'Content-Length': Buffer.byteLength(data),
            'Connection': 'close'
        }
    };
    // increase request counter
    requestCount = requestCount + 1;
    if ((protocol || '').indexOf('s') > -1) {
        req = https.request(options, (res) => {
            requestCount = requestCount - 1;
            requestEvent.emit('send_request');
        })
    } else {
        req = http.request(options, (res) => {
            requestCount = requestCount - 1;
            requestEvent.emit('send_request');
        })
    }
=======
            'Content-Length': Buffer.byteLength(data)
        }
    };
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

    // increase request counter
    requestCount = requestCount + 1;
    req = http.request(options, (res) => {
        res.on('end', async () => {
            // decrease request counter
            requestCount = requestCount - 1;
        });
    });
>>>>>>> b13ad2330c1cd7e5bcfabccb59fb80d6f5843426
    req.write(data);
    req.end();

    req.on('error', (e) => {
<<<<<<< HEAD
        // decrease request counter
        requestCount = requestCount - 1;
        requestEvent.emit('send_request');
=======
        console.error(e);
>>>>>>> b13ad2330c1cd7e5bcfabccb59fb80d6f5843426
    });
};

/**
 * @function getRequestCount
 * 
 * @returns {Number} Number of current opened request
 */
const getRequestCount = () => {
    return requestCount;
}

module.exports = {
    makeRequest,
    getRequestCount
};
