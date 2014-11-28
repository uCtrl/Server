'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
	uuid = require('node-uuid'),
	UTask = mongoose.model('UTask'),
	UCondition = mongoose.model('UCondition'),
	Logs = mongoose.model('Log');

exports.all = function (req, res) {
	var taskId = req.params.taskId;

	UTask.findOne({ id: taskId}, function(err, task) {
		UCondition.find({ _task: task._id }, function(err, conditions) {
			if (err) {
				return res.status(500).json({
					status: false,
					error: err
				});
			}
			
			UCondition.emit('all', req.user, conditions);
			res.json({
				status: true,
				error: null,
				conditions: conditions
			});
		});
	});
};

exports.create = function(req, res) {
	var taskId = req.params.taskId;
	var condition = new UCondition(req.body);

	UTask.findOne({ id: taskId }).exec(function(err, task) {
		if (err) {
			return res.status(500).json({
				status: false,
				error: err
			});
	    }
		
		condition["id"] = uuid.v1();
		condition["_task"] = task._id;
		condition["_user"] = req.user
		condition.save(function(err) {
			if (err) {
				return res.status(500).json({
					status: false,
					error: err
				});
			}
			
			UCondition.emit('create', req.user, condition);
			res.json({
				status: true,
				error: null,
				condition: condition
			});
		});
	});
};

exports.update = function(req, res) {
	var conditionId = req.params.conditionId;

	UCondition.findOneAndUpdate(
		{ id: conditionId }, 
		req.body,
		function (err, condition) {
			if (err) {
				return res.status(500).json({
					status: false,
					error: err
				});
			}
			
			UCondition.emit('update', req.user, condition);

			UTask.find({id: condition._task}, function(err, task) {
				UScenario.find({id: task._scenario}, function(err, scenario) {
					UDevice.find({id: scenario._device}, function(err, device) {
						var l = new Logs({
							type: Logs.LOGTYPE.Scenario, 
							severity: Logs.LOGSEVERITY.Normal,  
							message: "A condition in task '" + task.name + "' was updated.",
							id: device.id,
							timestamp: Date.now()
						});

						l.save(function(err) {
							if (err) console.log("Error saving the Task update log");
						});
					});
				});
			});

			res.json({
				status: true,
				error: null,
				condition: condition 
			});
		}
	);
};

exports.destroy = function(req, res) {
	var conditionId = req.params.conditionId;

	UCondition.findOne({ id: conditionId }, function(err, condition) {
		if (err) {
			return res.status(500).json({
				status: false,
				error: err
			});
		}
		
		condition.remove(function(err, conditionObj) {
			if (err) {
				return res.status(500).json({
					status: false,
					error: err
				});
			}
			
			UCondition.emit('destroy', req.user, conditionObj);
			res.json({
				status: true,
				error: null,
				condition : conditionObj
			});
		});
	});
};

exports.show = function(req, res) {
	var conditionId = req.params.conditionId;

	UCondition.findOne({ id: conditionId }, function(err, condition) {
	    if (err) {
			return res.status(500).json({
				status: false,
				error: err
			});
		}
		
		UCondition.emit('show', req.user, condition);
	    res.json({
			status: true,
			error: null,
			condition: condition 
		});
	});
};