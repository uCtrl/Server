'use strict';

var mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
	_ 		 = require('lodash');

/**
 * Constants
 */
var UECONDITIONTYPE = {
	None: -1,
	Date: 1,
	Day: 2,
	Time: 3,
	Device: 4
};

var UECOMPARISONTYPE = {
	None: 0,
	GreaterThan: 0x1,
	LesserThan: 0x2,
	Equals: 0x4,
	InBetween: 0x8,
	Not: 0x16
};

/**
 * UCondition Schema
 */
var UConditionSchema = new Schema({
	id: {
		type: String,
		required: true,
		unique: true
	},
	type: {
		type: Number,
		required: true
	},
	comparisonType: {
		type: Number,
		required: true
	},
	beginDate: Date,
	endDate: Date,
	beginTime: Date,
	endTime: Date,
	_task: {
		type: Schema.Types.ObjectId, 
		ref: 'UTask',
		required: true
	}
});

/** 
 * Middlewares
 */
UConditionSchema.post('save', function (condition) {
	var UTask = mongoose.model('UTask');
	UTask.update(
		{ _id: condition._task }, 
		{ $addToSet: { _conditions: condition._id } }, 
		{ safe: true },
		function (err, num) { if (err) console.log("Error: ", err) });
})

UConditionSchema.post('remove', function (condition) {
	var UTask = mongoose.model('UTask');

	UTask.update(
		{ _id: condition._task }, 
		{ $pull: { _conditions: condition._id } }, 
		{ safe: true },
		function (err, num) { if (err) console.log("Error: ", err) });
})

/*
	//
	// fromNinjaBlocks
	// https://github.com/ninjablocks/ninjablocks.github.com/wiki/Rules-Engine-Documentation
	//
	fromNinjaBlocks: {

		all: function(req, cb) {
			var ucondition = mongoose.model('UCondition');

			ninja.rules(function(err, arrRules){
				var out = [];
				arrRules.forEach(function(ruleObj, ruleIndex){
					if(ruleObj.rid == req.params.taskId){
						ruleObj.preconditions.forEach(function(precondObj, precondIndex){
							var obj = new ucondition({
								id				: null,
								type			: UECONDITIONTYPE.Device,		//TODO
								beginValue		: precondObj.params.value,
								endValue		: precondObj.params.value,
								beginDate		: null,
								endDate			: null,
								beginTime		: null,
								endTime			: null,
								comparisonType	: UECOMPARISONTYPE.GreaterThan, //TODO
								deviceId		: precondObj.params.guid,
								deviceType		: null,
								equality		: precondObj.params.equality,	//TODO
								handler			: precondObj.handler,			//TODO
								to				: precondObj.params.to,			//TODO
							});
							out.push(obj);
						});
					}
				});
				return cb(out);
			});
		},
		
		show: function(req, cb) {
			return "Ninja preconditions don't have ids.";	//TODO
		},
    }
*/

mongoose.model('UCondition', UConditionSchema);