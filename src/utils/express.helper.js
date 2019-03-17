const bodyParser = require('body-parser');

let app = null

module.exports = function () {
    if (!app) {
        app = require('express')();

        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
    }
    return app;
}();
