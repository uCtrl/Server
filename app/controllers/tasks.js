'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
	uuid = require('node-uuid'),
	UScenario = mongoose.model('UScenario'),
	UTask = mongoose.model('UTask');
		
exports.all = function(req, res) {
	var scenarioId = req.params.scenarioId;

	UTask.find({ _scenario: scenarioId }).sort('id').exec(function(err, tasks) {
		if (err) {
			return res.json(500, {
				status: false,
				error: err//"Can't list the tasks for scenario " + scenarioId
			});
	    }
		
		UTask.emit('all', req.uCtrl_User, tasks);
		res.json({
			status: true,
			error: null,
			tasks: tasks
		});
	});
};

exports.create = function(req, res) {
	var scenarioId = req.params.scenarioId;
	var task = new UTask(req.body);

	UScenario.findOne({ id: scenarioId }).exec(function(err, scenario) {
		if (err) {
			return res.json(500, {
				status: false,
				error: err//"Can't find the associated scenario " + scenarioId
			});
	    }		
		task["id"] = uuid.v1();
		task["_scenario"] = scenario._id;
		task.save(function(err) {
			if (err) {
				return res.json(500, {
					status: false,
					error: err//"Can't create the scenario"
				});
			}
			
			UTask.emit('create', req.uCtrl_User, task);
			res.json({
				status: true,
				error: null,
				task: task
			});
		});
	});
};

exports.update = function(req, res) {
	var taskId = req.params.taskId;

	UTask.findOneAndUpdate(
		{ id: taskId }, 
		req.body,
		function (err, task) {
			if (err) {
				return res.json(500, {
					status: false,
					error: err//"Can't update task " + taskId
				});
			}
			
			UTask.emit('update', req.uCtrl_User, task);
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
			return res.json(500, {
				status: false,
				error: err//"Can't delete task " + taskId
			});
		}
		
		UTask.emit('destroy', req.uCtrl_User, task);
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
			return res.json(500, {
				status: false,
				error: err//"Can't retrieve task " + taskId
			});
		}
		
		UTask.emit('show', req.uCtrl_User, task);
	    res.json({
			status: true,
			error: null,
			task: task
		});
	});
};