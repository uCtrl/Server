'use strict';

var logs = require(__base + 'app/controllers/logs.js');
var system = require(__base + 'app/controllers/system.js');
var platforms = require(__base + 'app/controllers/platforms.js');
var devices = require(__base + 'app/controllers/devices.js');
var scenarios = require(__base + 'app/controllers/scenarios.js');
var tasks = require(__base + 'app/controllers/tasks.js');
var conditions = require(__base + 'app/controllers/conditions.js');
var users = require(__base + 'app/controllers/users.js');
var stats = require(__base + 'app/controllers/stats.js');

module.exports = function(app) {

    app.get('/logs', logs.read);

    app.route('/stats')
       .get(stats.read);

    app.route('/users')
        .post(users.create);
		
	app.route('/users/:token')
		.get(users.fetchAll)
		.put(users.pushAll);

    app.route('/system')
        .get(system.all);
		
	app.route('/system/:token')
		.get(system.fetchAll)
		.put(system.pushAll);

    app.route('/platforms')
        .get(platforms.all)
        .post(platforms.create);

    app.route('/platforms/:platformId')
        .get(platforms.show)
        .put(platforms.update)
        .delete(platforms.destroy);

    app.route('/platforms/:platformId/devices')    
        .get(devices.all)
        .post(devices.create);

    app.route('/platforms/:platformId/devices/:deviceId')
        .get(devices.show)
        .put(devices.update)
        .delete(devices.destroy);    

    app.route('/platforms/:platformId/devices/:deviceId/stats')
        .get(devices.stats);

    app.route('/platforms/:platformId/devices/:deviceId/logs')
        .get(devices.logs);

    app.route('/platforms/:platformId/devices/:deviceId/scenarios')
	    .get(scenarios.all)
        .post(scenarios.create);

    app.route('/platforms/:platformId/devices/:deviceId/scenarios/:scenarioId')
        .get(scenarios.show)
        .put(scenarios.update)
        .delete(scenarios.destroy); 
    
    app.route('/platforms/:platformId/devices/:deviceId/scenarios/:scenarioId/tasks')
	    .get(tasks.all)
        .post(tasks.create);

    app.route('/platforms/:platformId/devices/:deviceId/scenarios/:scenarioId/tasks/:taskId')
        .get(tasks.show)
        .put(tasks.update)
        .delete(tasks.destroy);

    app.route('/platforms/:platformId/devices/:deviceId/scenarios/:scenarioId/tasks/:taskId/conditions')
        .get(conditions.all)
        .post(conditions.create);

    app.route('/platforms/:platformId/devices/:deviceId/scenarios/:scenarioId/tasks/:taskId/conditions/:conditionId')
        .get(conditions.show)
        .put(conditions.update)
        .delete(conditions.destroy);
};