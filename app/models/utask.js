'use strict';

/**
 * µCtrl Model
 */

var _ = require('lodash');
var mongoose = require('mongoose');
var schema = mongoose.Schema;

/*UTask*/
var UTaskSchema 	= new schema({
	id				: Number,
	status			: String,
	conditions		: [mongoose.model('UCondition').schema],
});
mongoose.model('UTask', UTaskSchema);