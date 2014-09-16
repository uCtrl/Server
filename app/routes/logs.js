'use strict';

module.exports = function(app) {
    // Home route
    var logs = require('../controllers/logs.js');
    app.get('/logs', logs.render);
    var stats = require('../controllers/stats.js');
    app.get('/stats', stats.render);
};