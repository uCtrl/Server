'use strict';

/**
 * Dependencies
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StatSchema = new Schema({
	// Ninja equivalents
	id: { type: String, required: true},
	data: { type: String, required: true},
	type: { type: Number, required: true},
	timestamp: { type: Number, required: true}
});

// Model creation
var Stats = mongoose.model('Stats', StatSchema);
