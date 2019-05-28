# Tretton37 Backend task

## Description of the task

Connect to the twitter api and listen for new tweets. When a new tweet comes send the tweet to all your subscribers as fast as possible.

## Description of the solution

Connect to the twitter tweet socket api and listen for new tweets. When a new tweet comes it saves it into redis and send an event to start making requests.
Then it checks if it currently is sending requests. If not pop first tweet in the list and start making requests.
If no data is in redis get it from mongo where all the urls are stored and start making requests.

## How to run
```
REDIS_PORT=<redis port> REDIS_HOST=<redis host> MONGO_URL=<mongo connection string> node index.js
```
or (if you change the ports and connections to redis and mongo)
```
npm run start
```
