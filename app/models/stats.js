'use strict';

/**
 * Dependencies
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var StatSchema = new Schema({

	/* TODO: CHANGE THIS SCHEMA */
	/*
	type: { type: String, required: true},
	deviceId: { type: Number, required: false},
	newValue: { type: Object, required: false},
	timestamp: { type: Number, required: true},
	*/
});

// Model creation
var Stats = mongoose.model('Stat', StatSchema);