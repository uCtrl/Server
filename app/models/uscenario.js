'use strict';

/**
 * µCtrl Model
 */

var _ = require('lodash');
var mongoose = require('mongoose');
var schema = mongoose.Schema;

/*UScenario*/
var UScenarioSchema = new schema({
	id				: Number,
	name			: String,
	tasks			: [mongoose.model('UTask').schema],
});
mongoose.model('UScenario', UScenarioSchema);