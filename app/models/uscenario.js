'use strict';

var mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
	cleanJson = require('./cleanJson.js'),
	_ = require('lodash');

/**
 * UScenario Schema
 */
var UScenarioSchema = new Schema({
	id: {
		type: String,
		required: true,
		unique: true
	},
	name: {
		type: String,
		required: true
	},
	_device: {
		type: Schema.Types.ObjectId, 
		ref: 'UDevice',
		required: true
	},
	_tasks: [{
		type: Schema.Types.ObjectId, 
		ref: 'UTask'
	}] 
});

UScenarioSchema.post('save', function (scenario) {
	var UDevice = mongoose.model('UDevice');
	UDevice.update(
		{ _id: scenario._device }, 
		{ $addToSet: { _scenarios: scenario._id } }, 
		{ safe: true },
		function (err, num) { if (err) console.log("Error: ", err) });
})

UScenarioSchema.post('remove', function (scenario) {
	var UDevice = mongoose.model('UDevice');
	var UTask = mongoose.model('UTask');

	UDevice.update(
		{ _id: scenario._device }, 
		{ $pull: { _scenarios: scenario._id } }, 
		{ safe: true },
		function (err, num) { if (err) console.log("Error: ", err) });

	UTask.find({ _id: { $in: scenario._tasks } }, function(err, tasks) {
		if (err) {
			console.log("Error: ", err);
			return;
		}
		_(tasks).forEach(function(task) { task.remove() } );
	});
})

UScenarioSchema.plugin(cleanJson);
mongoose.model('UScenario', UScenarioSchema);