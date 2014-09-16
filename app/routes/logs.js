'use strict';

module.exports = function(app) {
    // Home route
    var logs = require('../controllers/logs.js');

    app.get('/logs', logs.read);
    app.get('/logs/:deviceId', logs.read);
    app.post('/logs', logs.create);
};