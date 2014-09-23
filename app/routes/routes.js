'use strict';

module.exports = function(app) {
    // Home route
    var index = require('../controllers/index');
    app.get('/', index.render);


    var logs = require('../controllers/logs.js');
    app.get('/logs', logs.read);
    app.get('/logs/:deviceId', logs.read);
    app.post('/logs', logs.create);

	//System
	//Platform
	//Device
	var device = require('../controllers/device.js');
    app.get('/device', device.get);
	//Scenario
	var scenario = require('../controllers/scenario.js');
    app.get('/scenario', scenario.get);
    app.get('/scenario/:deviceId', scenario.get);
	//Task
	var task = require('../controllers/task.js');
    app.get('/task', task.get);
    app.get('/task/:scenarioId', task.get);
	//Condition
	var condition = require('../controllers/condition.js');
    app.get('/condition', condition.get);
    app.get('/condition/:taskId', condition.get);
};