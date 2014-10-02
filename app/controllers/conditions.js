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
				error: err//"Can't list the tasks for task " + taskId
			});
	    }
		res.json(conditions);
	});
};

exports.create = function(req, res) {
	var taskId = req.params.taskId;
	var condition = new UCondition(req.body);

	UTask.findOne({ id: taskId }).exec(function(err, task) {
		if (err) {
			return res.json(500, {
				error: err//"Can't find the associated task " + taskId
			});
	    }		
		condition["_task"] = task._id;
		condition.save(function(err) {
			if (err) {
				return res.json(500, {
					error: err//"Can't create the condition"
				});
			}
			res.json(condition);
		});
	});
};

exports.update = function(req, res) {
	var conditionId = req.params.conditionId;

	UCondition.findOne({ id: conditionId }, function(err, condition) { 
		if (err) {
			return res.json(500, {
				error: err//"Can't find condition " + conditionId + " to update"
			});
		}
		condition = _.extend(condition, req.body);
		condition.save(function(err) {
			if (err) {
				return res.json(500, {
					error: err//"Can't update condition " + conditionId
				});
			}
			res.json(condition);
		});
	});
};


exports.destroy = function(req, res) {
	var conditionId = req.params.conditionId;

	UCondition.findOne({ id: conditionId }, function(err, condition) {
		if (err) {
			return res.json(500, {
				error: err//"Can't delete condition " + conditionId
			});
		}
		res.json(condition.remove());
	});
};

exports.show = function(req, res) {
	var conditionId = req.params.conditionId;

	UCondition.findOne({ id: conditionId }, function(err, condition) {
	    if (err) {
			return res.json(500, {
				error: err//"Can't retrieve condition " + conditionId
			});
		}
	    res.json(condition);
	});
};