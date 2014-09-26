'use strict';

var index = require(__base + 'app/controllers/index');
var logs = require(__base + 'app/controllers/logs.js');
var platforms = require(__base + 'app/controllers/platforms.js');
var devices = require(__base + 'app/controllers/devices.js');
var scenarios = require(__base + 'app/controllers/scenarios.js');
var tasks = require(__base + 'app/controllers/tasks.js');
var conditions = require(__base + 'app/controllers/conditions.js');

//For tests purposes
var tests = require(__base + 'app/controllers/tests.js');

module.exports = function(app) {
    
    app.get('/', index.render);

    app.get('/logs', logs.read);
    app.get('/logs/:deviceId', logs.read);
    app.post('/logs', logs.create);
	
	//For tests purposes
	app.get('/tests', tests.read);

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

    /*  Params will be useful when we have a DB, but for now, it will do a new request each time...
    app.param('platformId', platforms.platform);
    app.param('deviceId', devices.device);
    app.param('scenarioId', scenarios.scenario);
    app.param('taskId', tasks.task);
    app.param('conditionId', conditions.condition);
    */
};