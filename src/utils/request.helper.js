const querystring = require('querystring');
const http = require('http');
// const https = require('https');
const { parse: urlParser } = require('url');
const requestEvent = require('../utils/requestEvent.helper')

// number of currently opened requests
let requestCount = 0;

/**
 * @function makeRequest
 *
 * @param {String} url 
 * @param {String} tweet 
 */
const makeRequest = (url, tweet) => {
    const { protocol = 'http', hostname, port, path } = urlParser(url);
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
    req.write(data);
    req.end();

    req.on('error', (e) => {
        // decrease request counter
        requestCount = requestCount - 1;
        requestEvent.emit('send_request');
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
