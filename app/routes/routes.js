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
var recommendations = require(__base + 'app/controllers/recommendations.js');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(app) {

	app.use(function(req, res, next){
		var uCtrlToken = req.get("X-uCtrl-Token");
		if (uCtrlToken) {
			User.findById(uCtrlToken, function(err, user) {
				req.user = user;
                next();
			});
		} else {
            next();
        }
	});

    var hasAuthorization = function(req, res, next) {
        if (!req.user) {
            return res.json(401, { 
                status: false, 
                error: "User unspecified" 
            });
        }
        next();
    };

	app.route('/logs')
       .get(hasAuthorization, logs.read);

    app.route('/stats')
       .get(hasAuthorization, stats.read);

    app.route('/users')
        .post(users.create);

    app.route('/system')
        .get(hasAuthorization, system.all);
		
	app.route('/system/fetchAll')
		.get(hasAuthorization, system.fetchAll)

    app.route('/recommendations')
        .get(hasAuthorization, recommendations.read);

    app.route('/recommendations/:recommendationId')    
        .put(hasAuthorization, recommendations.accept);

    app.route('/platforms')
        .get(hasAuthorization, platforms.all)
        .post(hasAuthorization, platforms.create);

    app.route('/platforms/:platformId')
        .get(hasAuthorization, platforms.show)
        .put(hasAuthorization, platforms.update)
        .delete(hasAuthorization, platforms.destroy);

    app.route('/platforms/:platformId/devices')    
        .get(hasAuthorization, devices.all)
        .post(hasAuthorization, devices.create);

    app.route('/platforms/:platformId/devices/:deviceId')
        .get(hasAuthorization, devices.show)
        .put(hasAuthorization, devices.update)
        .delete(hasAuthorization, devices.destroy);    

    app.route('/platforms/:platformId/devices/:deviceId/stats')
        .get(hasAuthorization, stats.read);

    app.route('/platforms/:platformId/devices/:deviceId/logs')
        .get(hasAuthorization, logs.read);

    app.route('/platforms/:platformId/devices/:deviceId/scenarios')
	    .get(hasAuthorization, scenarios.all)
        .post(hasAuthorization, scenarios.create);

    app.route('/platforms/:platformId/devices/:deviceId/scenarios/:scenarioId')
        .get(hasAuthorization, scenarios.show)
        .put(hasAuthorization, scenarios.update)
        .delete(hasAuthorization, scenarios.destroy); 
    
	app.route('/platforms/:platformId/devices/:deviceId/scenarios/:scenarioId/enable')
        .post(hasAuthorization, scenarios.enable);
		
    app.route('/platforms/:platformId/devices/:deviceId/scenarios/:scenarioId/tasks')
	    .get(hasAuthorization, tasks.all)
        .post(hasAuthorization, tasks.create);

    app.route('/platforms/:platformId/devices/:deviceId/scenarios/:scenarioId/tasks/:taskId')
        .get(hasAuthorization, tasks.show)
        .put(hasAuthorization, tasks.update)
        .delete(hasAuthorization, tasks.destroy);

    app.route('/platforms/:platformId/devices/:deviceId/scenarios/:scenarioId/tasks/:taskId/conditions')
        .get(hasAuthorization, conditions.all)
        .post(hasAuthorization, conditions.create);

    app.route('/platforms/:platformId/devices/:deviceId/scenarios/:scenarioId/tasks/:taskId/conditions/:conditionId')
        .get(hasAuthorization, conditions.show)
        .put(hasAuthorization, conditions.update)
        .delete(hasAuthorization, conditions.destroy);
};