'use strict';

module.exports = function(app) {
    // Home route
    var index = require('../controllers/index');
    app.get('/', index.render);


    var logs = require('../controllers/logs.js');
    app.get('/logs', logs.read);
    app.get('/logs/:deviceId', logs.read);
    app.post('/logs', logs.create);

};