'use strict';

/**
 * µCtrl Model
 */

var _ = require('lodash');
var mongoose = require('mongoose');
var schema = mongoose.Schema;

/*UCondition*/
var UConditionSchema = new schema({
	id				: Number,
	type			: Number,
	beginValue		: Number,
	comparisonType	: Number,
	deviceId		: Number,
	deviceType		: Number,
	endValue		: Number,
});
mongoose.model('UCondition', UConditionSchema);