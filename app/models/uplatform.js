'use strict';

/**
 * µCtrl Model
 */

var _ = require('lodash');
var mongoose = require('mongoose');
var schema = mongoose.Schema;
//var udevice = require('../models/udevice.js');
var udevice  = mongoose.model('UDevice').schema;

/*UPlatform*/
var uplatformSchema	= new schema({
	firmwareVersion	: String,
	id				: Number,
	name			: String,
	port			: Number,
	room			: String,
	enabled			: String,
	ip				: String,
	devices			: [udevice],
});
mongoose.model('UPlatform', uplatformSchema);
/*
var uplatform = mongoose.model('UPlatform');
module.exports = uplatform;
*/