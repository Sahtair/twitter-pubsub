/**
 * TODO:
 * - keep urls cached and store new tweets in redis (around 10k cached urls)
 * - make use of event emiters to send new requests
 * - have counter to check when all requests for one tweet are done
 * - have a counter in redis and length in redis
 * STORE EVERYTHING IN REDIS CUZ ITS SIMPLE
*/
const requestEvent = require('../utils/requestEvent.helper')
const EventEmitter = require('events');
const { makeRequest, getRequestCount } = require('../utils/request.helper')
const { listItems } = require('../database/subscribers.controller')
const {
    DATA,
    CURRENT_ROW_OFFSET,
    TWEETS,
    CURRENT_TWEET
} = require('./constants/cache.constants')
const {
    setCache,
    getCache,
    setListCache,
    getListLength,
    popElement
} = require('../utils/cache.helper')

const event = new EventEmitter();
// url list delimiter
const listDelimiter = 'some delimiter';
// limit for fetching data
const dataLimit = 30000; // also affset
// limit for how many request can be send at once
const requestCap = 5000;

let fetchingData = false;

requestEvent.on('start_requests', async () => {
    // check if we are currently making requests. If there is a current tweet
    // that means we are making requests
    
    // set row offset to 0
    const offset = 0;
    //console.log(`[${new Date()}] start making requests`);
    if (!await getCache(CURRENT_TWEET)) {
        // if not pop next tweet in tweet list and insert it into current tweet
        // and get data

        // get next tweet
        const currentTweet = await popElement(TWEETS);
        // set new current tweet
        await Promise.all([
            setCache(CURRENT_TWEET, currentTweet),
            setCache(CURRENT_ROW_OFFSET, dataLimit)
        ]);
    }
    // push data to list
    const dataLen = await getListLength(DATA);
    // if no data in data list get data.
    if (Number(dataLen) === 0 && !fetchingData) {
        fetchingData = true;
        const { data, count } = await listItems(offset, dataLimit);
        // if dataLimit is greater or equal to count reset offset to 0
        if (count <= dataLimit) {
            await setCache(CURRENT_ROW_OFFSET, 0)
        }
        await setListCache(DATA, data);
        fetchingData = false;
    }
    // start making requests
    if (Number(dataLen) > 0) {
        for (let i = getRequestCount(); i < requestCap; i++) {
            event.emit('send_request');
        }
    }
});

event.on('send_request', async () => {
    // if there is less then 1000 requests make new request
    if (getRequestCount() < requestCap) {
        // get new url and current tweet
        let [ url, tweet ] = await Promise.all([
            popElement(DATA),
            getCache(CURRENT_TWEET)
        ])

        // get new tweet if url is equal to list delimiter
        if (url === listDelimiter) {
            tweet = await popElement(TWEETS);
            [ url ] = await Promise.all([
                popElement(DATA), // get new url
                setCache(CURRENT_TWEET, tweet) // set new current tweet
            ]) 
        }
        // if there is less thena 200 urls in cache get more data
        if (await getListLength(DATA) < (requestCap * 2)) {
            event.emit('prefetch_data');
        }
        if (url) {
            makeRequest(url, tweet)
        }
    }
});

// prefetch data for requests
event.on('prefetch_data', async () => {
    // if data is already being fetched dont do it again.
    if (!fetchingData) {
        try {
            fetchingData = true;
            // get current row offset
            const offset = Number(await getCache(CURRENT_ROW_OFFSET)); 
            let newOffset = offset + dataLimit;
            // set fetching data to true
            // get more data
            const { data, count } = await listItems(offset, dataLimit);
            // push data to list
            await setListCache(DATA, data);
            // if new offset is greater or equal to count get new data with
            // offset 0 and add to the queue
            if (newOffset >= count) {
                newOffset = dataLimit;
                const { data: newData, count: newCount } = await listItems(0, dataLimit);
                // push new data to list with delimiter to know when to change
                // current tweet
                await setListCache(DATA, [listDelimiter].concat(newData));
                // reset offset to 0 if new count is greater or equal to offset
                if (newCount <= newOffset) {
                    newOffset = 0;
                }
            }

            // change row offset
            await setCache(CURRENT_ROW_OFFSET, newOffset);
            fetchingData = false;
        } catch (e) {
            console.error(e)
        }
    }
});
