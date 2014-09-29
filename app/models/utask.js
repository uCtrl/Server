'use strict';

/**
 * µCtrl Model
 */

var _ = require('lodash');
var mongoose = require('mongoose');
var schema = mongoose.Schema;
//var ucondition = require('../models/ucondition.js');
var ucondition  = mongoose.model('UCondition').schema;

/*UTask*/
var UTaskSchema 	= new schema({
	id				: Number,
	status			: String,
	conditions		: [ucondition],
});
mongoose.model('UTask', UTaskSchema);