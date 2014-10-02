'use strict';

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
