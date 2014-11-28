'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
	uuid = require('node-uuid'),
	UScenario = mongoose.model('UScenario'),
	UTask = mongoose.model('UTask'),
	UCondition = mongoose.model('UCondition'),
	Logs = mongoose.model('Log');
		
exports.all = function(req, res) {
	var scenarioId = req.params.scenarioId;

	UScenario.findOne({ id: scenarioId}, function(err, scenario) {
		UTask.find({ _scenario: scenario._id }, function(err, tasks) {
			if (err) {
				return res.status(500).json({
					status: false,
					error: err
				});
		    }
			
			UTask.emit('all', req.user, tasks);
			res.json({
				status: true,
				error: null,
				tasks: tasks
			});
		});
	});
};

exports.create = function(req, res) {
	var scenarioId = req.params.scenarioId;
	var task = new UTask(req.body);
	var conditions = req.body.conditions;

	UScenario.findOne({ id: scenarioId }).exec(function(err, scenario) {
		if (err) {
			return res.status(500).json({
				status: false,
				error: err
			});
	    }
		
		if (scenario) {
			task["id"] = uuid.v1();
			task["_scenario"] = scenario._id;
			task["_user"] = req.user._id;
			task.save(function(err) {
				if (err) {
					return res.status(500).json({
						status: false,
						error: err
					});
				}
				
				UTask.emit('create', req.user, task);
				
				if (_.isArray(conditions)) {
					var conditionsSize = conditions.length;
					var conditionsIt = 0;
					
					_(conditions).forEach(function(conditionObj, conditionIndex) {
						conditionsIt++;
						var condition = new UCondition(conditionObj);
						
						condition["id"] = uuid.v1();
						condition["_task"] = task._id;
						condition["_user"] = req.user._id;
						condition.save(function(err) {
							if (err) console.log("Error: ", err)
							UCondition.emit('create', req.user, condition);
						});
					});
				}

				res.json({
					status: true,
					error: null,
					task: task
				});
			});
		}
	});
};

exports.update = function(req, res) {
	var taskId = req.params.taskId;

	UTask.findOneAndUpdate(
		{ id: taskId }, 
		req.body,
		function (err, task) {
			if (err) {
				return res.status(500).json({
					status: false,
					error: err
				});
			}
			
			UTask.emit('update', req.user, task);
			var l = new Logs({
				type: Logs.LOGTYPE.Scenario, 
				severity: Logs.LOGSEVERITY.Normal,  
				message: "Task '" + task.name + "' was updated.",
				id: task.id,
				timestamp: Date.now()
			});

			l.save(function(err) {
				if (err) console.log("Error saving the Task update log");
			});
			res.json({
				status: true,
				error: null,
				task: task
			});
		}
	);
};

exports.destroy = function(req, res) {
	var taskId = req.params.taskId;

	UTask.findOne({ id: taskId }, function(err, task) {
		if (err) {
			return res.status(500).json({
				status: false,
				error: err
			});
		}
		
		UTask.emit('destroy', req.user, task);
		res.json({
			status: true,
			error: null,
			task: task.remove()
		});
	});
};

exports.show = function(req, res) {
	var taskId = req.params.taskId;

	UTask.findOne({ id: taskId }, function(err, task) {
	    if (err) {
			return res.status(500).json({
				status: false,
				error: err
			});
		}
		
		UTask.emit('show', req.user, task);
	    res.json({
			status: true,
			error: null,
			task: task
		});
	});
};