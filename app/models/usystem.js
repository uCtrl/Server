'use strict';

/**
 * µCtrl Model
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var USystemSchema = new Schema({
	rev    			: Number,
	platforms 		: [UPlatformSchema],
});

var UPlatformSchema = new Schema({
	firmwareVersion	: String,
	id				: Number,
	name			: String,
	port			: Number,
	room			: String,
	enabled			: String,
	ip				: String,
	devices			: [UDeviceSchema],
});

var UDeviceSchema = new Schema({
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
	scenarios		: [UScenarioSchema],
});

var UScenarioSchema = new Schema({
	id				: Number,
	name			: String,
	tasks			: [UTaskSchema],
});

var UTaskSchema = new Schema({
	id				: Number,
	status			: String,
	conditions		: [UConditionSchema],
});

var UConditionSchema = new Schema({
	id				: Number,
	type			: Number,
	beginValue		: Number,
	comparisonType	: Number,
	deviceId		: Number,
	deviceType		: Number,
	endValue		: Number,
});

mongoose.model('USystem', USystemSchema);

/*
Example of code to use
****************************
// retrieve my model
var system = mongoose.model('USystem');

// create a sample
var test = new system();
test.rev = 1;
// create a comment
test.platforms.push({ 
	firmwareVersion	: "1.0.0.2225",
	id				: 157257547,
	name			: "My other platform",
	port			: 5000,
	room			: "Kitchen",
	enabled			: "OFF",
	ip				: "127.0.0.1",
});

test.save(function (err) {
  if (!err) console.log('Success!');
});

system.find({ 'platforms.id': 157257547}, function (err, doc){
  console.log(doc);
})

*/