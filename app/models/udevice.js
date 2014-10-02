'use strict';

var mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
	_ 		 = require('lodash');

/**
 * UDevice Schema
 */
var UDeviceSchema = new Schema({
	id: {
		type: String,
		required: true,
		unique: true
	},
	type: { 
		type: Number,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	description: String,
	enabled: Boolean,
	isTriggerValue: Boolean,
	maxValue: Number,
	minValue: Number,
	precision: Number,
	status: Number,
	unitLabel: String,
	_platform: {
		type: Schema.Types.ObjectId, 
		ref: 'UPlatform',
		required: true
	},
	_scenarios: [{
		type: Schema.Types.ObjectId, 
		ref: 'UScenario'
	}] 
});

UDeviceSchema.post('save', function (device) {
	var UPlatform = mongoose.model('UPlatform');
	UPlatform.update(
		{ _id: device._platform }, 
		{ $addToSet: { _devices: device._id } }, 
		{ safe: true },
		function (err, num) { if (err) console.log("Error: ", err) });
})

UDeviceSchema.post('remove', function (device) {
	var UPlatform = mongoose.model('UPlatform');
	var UScenario = mongoose.model('UScenario');

	UPlatform.update(
		{ _id: device._platform }, 
		{ $pull: { _devices: device._id } }, 
		{ safe: true },
		function (err, num) { if (err) console.log("Error: ", err) });

	UScenario.find({ _id: { $in: device._scenarios } }, function(err, scenarios) {
		if (err) {
			console.log("Error: ", err);
			return;
		}
		_(scenarios).forEach(function(scenario) { scenario.remove() } );
	});
})

mongoose.model('UDevice', UDeviceSchema);