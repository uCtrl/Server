'use strict';

var mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
	cleanJson = require('./cleanJson.js'),
	_ = require('lodash'),
	uuid = require('node-uuid');

/**
 * UScenario Schema
 */
var UScenarioSchema = new Schema({
	id: {
		type: String,
		required: true,
		unique: true
	},
	parentId: {
		type: String,
		required: true
	},
	tpId: String,
	name: String,
	enabled : Boolean,
	lastUpdated: Number,
	_device: {
		type: Schema.Types.ObjectId, 
		ref: 'UDevice',
		//required: true
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

// Can't use middleware on findAndUpdate functions

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

/*
 * Create default scenario
 */
UScenarioSchema.statics.createDefault = function (cb) {
	var UScenario = mongoose.model('UScenario');
	var scenario = new UScenario({
		id : uuid.v1(),
		tpId : null, 
		name : 'Default scenario ' + Date.now(),
		enabled : true,
		lastUpdated : null,
	});
	cb(scenario);
};

UScenarioSchema.plugin(cleanJson);
mongoose.model('UScenario', UScenarioSchema);