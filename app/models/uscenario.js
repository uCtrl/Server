'use strict';

/**
 * µCtrl Model
 */

var _ = require('lodash');
var mongoose = require('mongoose');
var schema = mongoose.Schema;
//var utask = require('../models/utask.js');
var utask  = mongoose.model('UTask').schema;

/*UScenario*/
var UScenarioSchema = new schema({
	id				: Number,
	name			: String,
	tasks			: [utask],
});
mongoose.model('UScenario', UScenarioSchema);