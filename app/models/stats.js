'use strict';

/**
 * Dependencies
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var StatSchema = new Schema({

	deviceId: { type: Number, required: true},
	deviceType: { type: String, required:true},
	timestamp: { type: Number, required: true},
	ampere: { type: Number, required: true},
	data: { type: Number, required: true},
	value: { type: Object, required:true}
});

// Model creation
var Stats = mongoose.model('Stat', StatSchema);

Stats.find(function (err, Stat) {
	if (Stats.length == 0) {
		new Stats ({
			deviceType: "Ligth",
			deviceId: 12345,
			timestamp: Date.now(),
			ampere: 24,
			data: 24,
			value: "ON",
		}).save();
		new Stats ({
			deviceType: "RF sensor",
			deviceId: 56783,
			//timestamp: Date.now(),
			ampere: 10,
			data: 10,
			value: "OFF",
		}).save
		new Stats ({
			deviceType: "Thermometer",
			deviceId: 34567,
			//timestamp: Date.now(),
			ampere: 5,
			date: 5,
			value: 25,
		}).save();
 	}
});