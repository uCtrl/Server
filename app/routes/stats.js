    'use strict';

module.exports = function(app, models) {
    // Home route
    var stats = require('../controllers/stats.js');
    app.get('/stats', stats.render);
};

