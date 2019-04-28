const querystring = require('querystring');
const http = require('http');
// const https = require('https');
const { parse: urlParser } = require('url');

// number of currently opened requests
const requestCount = 0;

/**
 * @function makeRequest
 *
 * @param {String} url 
 * @param {String} tweet 
 */
const makeRequest = (url, tweet) => {
    const { protocol = 'http', hostname, port, path } = urlParser(url);
    //console.log(protocol, hostname, port, path)
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
    req.write(data);
    req.end();

    req.on('error', (e) => {
        console.error(e);
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
