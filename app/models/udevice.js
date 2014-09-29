'use strict';

/**
 * µCtrl Model
 */

var _ = require('lodash');
var mongoose = require('mongoose');
var schema = mongoose.Schema;
//var uscenario = require('../models/uscenario.js');
var uscenario  = mongoose.model('UScenario').schema;

/*UDevice*/
var UDeviceSchema 	= new schema({
	description		: String,
	enabled			: String,
	id				: Number,
	isTriggerValue	: Boolean,
	maxValue		: Number,
	minValue		: Number,
	name			: String,
	precision		: Number,
	status			: Number,
	type			: Number,
	unitLabel		: String,
	scenarios		: [uscenario],
});
mongoose.model('UDevice', UDeviceSchema);