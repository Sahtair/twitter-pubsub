const EventEmitter = require('events');

let requestEvent = null;

module.exports = function () {
    if (!requestEvent) {
        requestEvent = new EventEmitter();
    }
    return requestEvent;
}();
