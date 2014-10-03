'use strict';

var mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
	cleanJson = require('./cleanJson.js'),
	_ 		 = require('lodash');

/**
 * UTask Schema
 */
var UTaskSchema = new Schema({
	id: {
		type: String,
		required: true,
		unique: true
	},
	handler			: String,
	timeout			: Number,
	suspended		: Boolean,
	status: Boolean,
	_scenario: {
		type: Schema.Types.ObjectId, 
		ref: 'UScenario',
		required: true
	},
	_conditions: [{
		type: Schema.Types.ObjectId, 
		ref: 'UCondition'
	}] 
});

/** 
 * Middlewares
 */
UTaskSchema.post('save', function (task) {
	var UScenario = mongoose.model('UScenario');
	UScenario.update(
		{ _id: task._scenario }, 
		{ $addToSet: { _tasks: task._id } }, 
		{ safe: true },
		function(err, num) { if (err) console.log("Error: ", err) });
})

UTaskSchema.post('remove', function (task) {
	var UScenario = mongoose.model('UScenario');
	var UCondition = mongoose.model('UCondition');

	UScenario.update(
		{ _id: task._scenario }, 
		{ $pull: { _tasks: task._id } }, 
		{ safe: true },
		function (err, num) { if (err) console.log("Error: ", err) });

	UCondition.find({ _id: { $in: task._conditions } }, function(err, conditions) {
		if (err) {
			console.log("Error: ", err);
			return;
		}
		_(conditions).forEach(function(condition) { condition.remove() } );
	});
})

/*
	fromNinjaBlocks: {
		all: function(req, cb) {
			var utask = mongoose.model('UTask');
			ninja.rules(function(err, arrRules){
				var out = [];
				arrRules.forEach(function(ruleObj, ruleIndex){
					if(ruleObj.actions[0].params.guid == req.params.deviceId){
						var obj = new utask({
							id				: ruleObj.rid,
							status			: ruleObj.actions[0].da,
							handler			: ruleObj.actions[0].handler,
							timeout			: ruleObj.timeout,
							suspended		: ruleObj.suspended,
						});
						out.push(obj);
					}
				});
				return cb(out);
			});
		},
		show: function(req, cb) {
			var utask = mongoose.model('UTask');
			ninja.rule(req.params.taskId, function(err, ruleObj){
				var obj = new utask({
					id			: ruleObj.rid,
					status		: ruleObj.actions[0].da,
					handler		: ruleObj.actions[0].handler,
					timeout		: ruleObj.timeout,
					suspended	: ruleObj.suspended,
				});
				return cb(obj);
			});
		},
    }*/

UTaskSchema.plugin(cleanJson);
mongoose.model('UTask', UTaskSchema);