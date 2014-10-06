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
var Stats = mongoose.model('Stats', StatSchema);
