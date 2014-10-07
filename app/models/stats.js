'use strict';

/**
 * Dependencies
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StatSchema = new Schema({
	// Ninja equivalents
	guid: { type: String, required: false}, // required false for now, we don't want to conflit with ninja
	data: { type: Object, required: true},
	deviceId: { type: Number, required: true},
	vendorId: { type: Number, required: false},
	portNumber: { type: Number, required: false},

	// Custom fields
	deviceType: { type: String, required:false}, // Not required, TODO: figure out the type via ninja?
	timestamp: { type: Number, required: true}
	//ampere: { type: Number, required: true}
});

// Model creation
var Stats = mongoose.model('Stats', StatSchema);
