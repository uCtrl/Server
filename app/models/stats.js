'use strict';

/**
 * Dependencies
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StatSchema = new Schema({
	// Ninja equivalents
	id: { type: String, required: false}, 
	data: { type: Object, required: true},
	type: { type: Number, required: true},
	vendor: { type: Number, required: false},
	timestamp: { type: Number, required: true}
});

// Model creation
var Stats = mongoose.model('Stats', StatSchema);
