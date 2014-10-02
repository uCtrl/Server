'use strict';

var mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
	_ 		 = require('lodash');

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
	beginDate: String,
	endDate: String,
	beginTime: String,
	endTime: String,
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

mongoose.model('UCondition', UConditionSchema);