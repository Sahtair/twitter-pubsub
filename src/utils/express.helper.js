const bodyParser = require('body-parser');
const express = require('express');

let app = null

module.exports = function () {
    if (!app) {
        app = express();

        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
    }
    return app;
}();
