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
    REQUEST_COUNT,
    CURRENT_ROW_OFFSET,
    TOTAL_ROWS,
    TWEETS,
    CURRENT_TWEET,
    FETCH_DATA
} = require('./constants/cache.constants')
const {
    setCache,
    getCache,
    setListCache,
    getListLength,
    popElement,
    invalidateCache,
    invalidateAll
} = require('../utils/cache.helper')

// symbols for events
const event = new EventEmitter();
const requestSymbol = new Symbol('Symbol for sending request event');
const dataGettingSymbol = new Symbol('Symbol for sending data getting event');
// url list delimiter
const listDelimiter = 'some delimiter';
// limit for fetching data
const dataLimit = 1000; // also affset

requestEvent.on('start_requests', async () => {
    // check if we are currently making requests. If there is a current tweet
    // that means we are making requests
    if (!await getCache(CURRENT_TWEET)) {
        // if not pop next tweet in tweet list and insert it into current tweet
        // and get data
        const offset = 0;
        // get next tweet
        const currentTweet = await popElement(TWEETS);
        // promise array
        let pr = [
            setCache(CURRENT_TWEET, currentTweet),
            setCache(CURRENT_ROW_OFFSET, dataLimit)
        ]
        // if no data in data list get data.
        if (await getListLength(DATA) === 0) {
            const { data } = await listItems(offset, dataLimit);
            pr.push(setListCache(DATA, data))
        }
        // set new current tweet
        // set row offset to 0
        // push data to list
        await Promise.all(pr);
    }
    // start making requests
    event.emit(requestSymbol);
});

event.on(requestSymbol, async () => {
    // if there is less then 1000 requests make new request
    if (getRequestCount() < 1000) {
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
        if (await getListLength(DATA) < 200) {
            // get current row offset
            const rowOffset = await getCache(CURRENT_ROW_OFFSET);
            // emit data getting event
            event.emit(dataGettingSymbol, rowOffset);
        }
        makeRequest(url, tweet)
    }
});

// prefetch data for requests
event.on(dataGettingSymbol, async (offset) => {
    // if data is already being fetched dont do it again.
    const fetchingData = await getCache(FETCH_DATA);
    if (!fetchingData) {
        try {
            let newOffset = offset + dataLimit;
            // set fetching data to true
            await setCache(FETCH_DATA, true);
            // get more data
            const { data, count } = await listItems(offset, dataLimit);
            // push data to list
            await setListCache(DATA, data);

            // if new offset is greater or equal to count get new data with
            // offset 0 and add to the queue
            if (newOffset >= count) {
                newOffset = dataLimit;
                const { data: newData } = await listItems(0, dataLimit);
                // push new data to list with delimiter to know when to change
                // current tweet
                await setListCache(DATA, [listDelimiter].concat(newData));
            }

            // change row offset
            await setCache(CURRENT_ROW_OFFSET, newOffset);
            await setCache(FETCH_DATA, false);
        } catch (e) {
            console.error(e)
        }
    }
});

module.exports = {
    makeRequest
}