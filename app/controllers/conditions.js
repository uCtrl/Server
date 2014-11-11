'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
	UTask = mongoose.model('UTask'),
	UCondition = mongoose.model('UCondition');

exports.all = function (req, res) {
	var taskId = req.params.taskId;

	UCondition.find({ _task: taskId }).sort('id').exec(function(err, conditions) {
		if (err) {
			return res.json(500, {
				status: false,
				error: err//"Can't list the tasks for task " + taskId
			});
		}
		
		UCondition.emit('all', conditions);
		res.json({
			status: true,
			error: null,
			conditions: conditions
		});
	});
};

exports.create = function(req, res) {
	var taskId = req.params.taskId;
	var condition = new UCondition(req.body);

	UTask.findOne({ id: taskId }).exec(function(err, task) {
		if (err) {
			return res.json(500, {
				status: false,
				error: err//"Can't find the associated task " + taskId
			});
	    }		
		condition["_task"] = task._id;
		condition.save(function(err) {
			if (err) {
				return res.json(500, {
					status: false,
					error: err//"Can't create the condition"
				});
			}
			
			UCondition.emit('create', condition);
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
				return res.json(500, {
					status: false,
					error: err//"Can't update condition " + conditionId
				});
			}
			
			UCondition.emit('update', condition);
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
			return res.json(500, {
				status: false,
				error: err//"Can't delete condition " + conditionId
			});
		}
		
		UCondition.emit('destroy', condition);
		res.json({
			status: true,
			error: null,
			condition: condition.remove()
		});
	});
};

exports.show = function(req, res) {
	var conditionId = req.params.conditionId;

	UCondition.findOne({ id: conditionId }, function(err, condition) {
	    if (err) {
			return res.json(500, {
				status: false,
				error: err//"Can't retrieve condition " + conditionId
			});
		}
		
		UCondition.emit('show', condition);
	    res.json({
			status: true,
			error: null,
			condition: condition 
		});
	});
};