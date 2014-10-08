'use strict';

var mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
	cleanJson = require('./cleanJson.js'),
	_ = require('lodash');

/**
 * UTask Schema
 */
var UTaskSchema = new Schema({
	id: {
		type: String,
		required: true,
		unique: true
	},
	name : String,
	suspended : Boolean,
	status : String,
	_scenario: {
		type: Schema.Types.ObjectId, 
		ref: 'UScenario',
		required: true
	},
	_conditions: [{
		type: Schema.Types.ObjectId, 
		ref: 'UCondition'
	}] 
});

/** 
 * Middlewares
 */
UTaskSchema.post('save', function (task) {
	var UScenario = mongoose.model('UScenario');
	UScenario.update(
		{ _id: task._scenario }, 
		{ $addToSet: { _tasks: task._id } }, 
		{ safe: true },
		function(err, num) { if (err) console.log("Error: ", err) });
})

UTaskSchema.post('remove', function (task) {
	var UScenario = mongoose.model('UScenario');
	var UCondition = mongoose.model('UCondition');

	UScenario.update(
		{ _id: task._scenario }, 
		{ $pull: { _tasks: task._id } }, 
		{ safe: true },
		function (err, num) { if (err) console.log("Error: ", err) });

	UCondition.find({ _id: { $in: task._conditions } }, function(err, conditions) {
		if (err) {
			console.log("Error: ", err);
			return;
		}
		_(conditions).forEach(function(condition) { condition.remove() } );
	});
})

/*
 * Receives the block (from NB) and will call the cb when mapped.
 * To logic here is only to do the mapping
 */
UTaskSchema.statics.fromNinjaBlocks = function (ninjaRule, ninjaRuleId, cb) {
	var UTask = mongoose.model('UTask');
	// Mapping Ninja to uCtrl
	// Limited to only one action by task when mapping to µCtrl.
	var task = new UTask({
		id : ninjaRuleId,
		name : ninjaRule.shortName,
		suspended : ninjaRule.suspended,
		status : ninjaRule.actions[0].da,	
	});
	cb(task);
};

/*
 * Receives the task (from MongoDB) and will call the cb when mapped
 * To logic here is only to do the mapping
 */
UTaskSchema.statics.toNinjaBlocks = function (task, cb) {
	var NB_TIMEOUT = 2;
	var NB_ACTIONHANDLER = "ninjaSendCommand";
	var deviceIdSplit = task._scenario._device.id.split(":");	//Subdevice data, if one, is stored into id.
	
	var ninjaRule = {
		shortName : task.name,
		timeout : NB_TIMEOUT,
		preconditions : null, //TODO : Check if it can be null now and updated after by ucondition.
		actions : [{ 
			handler: NB_ACTIONHANDLER, 
			params: { 
				guid : deviceIdSplit[0],
				to : (deviceIdSplit.length > 1 ? deviceIdSplit[1] : null),
				da : task.status,
			} 
		}]
	}
	cb(ninjaRule);
};

UTaskSchema.plugin(cleanJson);
mongoose.model('UTask', UTaskSchema);