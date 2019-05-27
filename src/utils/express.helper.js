const bodyParser = require('body-parser');
<<<<<<< HEAD
const express = require('express');
=======
>>>>>>> b13ad2330c1cd7e5bcfabccb59fb80d6f5843426

let app = null

module.exports = function () {
    if (!app) {
<<<<<<< HEAD
        app = express();
=======
        app = require('express')();
>>>>>>> b13ad2330c1cd7e5bcfabccb59fb80d6f5843426

        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
    }
    return app;
}();
