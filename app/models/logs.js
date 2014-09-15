'use strict';

/**
 * Dependencies
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var LogSchema = new Schema({
	type: { type: String, required: true},
	deviceId: { type: Number, required: false},
	newValue: { type: Object, required: false},
	timestamp: { type: Number, required: true},
});



// Model creation
var Logs = mongoose.model('Log', LogSchema);

// If nothing was found, create a few logs 
Logs.find(function (err, logs) {
	if (logs.length == 0) {
		new Logs ({
			type: "myType",
			deviceId: 13452352,
			newValue: "ON",
			timestamp: Date.now(),
		}).save();
		new Logs ({ 
			type: 'Action',
			deviceId: 13452352,
			newValue: 'ON',
			timestamp: Date.now()
		}).save();
		new Logs ({ 
			type: 'Status',
			deviceId: 13452353,
			newValue: 'ON',
			timestamp: Date.now()
		}).save();
		new Logs ({ 
			type: 'Status',
			deviceId: 13454352,
			newValue: 'OFF',
			timestamp: Date.now()
		}).save();
		new Logs ({ 
			type: 'Action',
			deviceId: 778867,
			newValue: 'OFF',
			timestamp: Date.now()
		}).save();
	}
});
