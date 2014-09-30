'use strict';

/**
 * µCtrl Model
 */

var _ = require('lodash');
var mongoose = require('mongoose');
var schema = mongoose.Schema;

/*UPlatform*/
var uplatformSchema	= new schema({
	firmwareVersion	: String,
	id				: Number,
	name			: String,
	port			: Number,
	room			: String,
	enabled			: String,
	ip				: String,
	devices			: [mongoose.model('UDevice').schema],
});
mongoose.model('UPlatform', uplatformSchema);