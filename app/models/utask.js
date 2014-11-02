'use strict';

var mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
	cleanJson = require('./cleanJson.js'),
	_ = require('lodash'),
	uuid = require('node-uuid');

/**
 * UTask Schema
 */
var UTaskSchema = new Schema({
	id: {
		type: String,
		required: true,
		unique: true
	},
	parentId: {
		type: String,
		required: true
	},
	tpId: {
		type: String,
		required: true,
		unique: true
	},
	name : String,
	value : String,
	enabled : Boolean,
	lastUpdated: Number,
	_scenario: {
		type: Schema.Types.ObjectId, 
		ref: 'UScenario',
		//required: true
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

// Can't use middleware on findAndUpdate functions

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
		id : uuid.v1(),
		tpId : ninjaRuleId,
		name : ninjaRule.shortName,
		value : _(ninjaRule.actions).first().params.da || null,
		enabled : ninjaRule.suspended,
		lastUpdated : null,
	});
	cb(task);
};

/*
 * Receives the task (from MongoDB) and will call the cb when mapped
 * To logic here is only to do the mapping
 */
UTaskSchema.statics.toNinjaBlocks = function (task, cb) {
	var UScenario = mongoose.model('UScenario');
	var UDevice = mongoose.model('UDevice');
	var NB_TIMEOUT = 2;
	var NB_ACTIONHANDLER = "ninjaSendCommand";
	var deviceTpIdSplit = null;
	
	UScenario.findById(task._scenario, function(err, scenario){
		UDevice.findById(scenario._device, function(err, device){
			deviceTpIdSplit = device.tpId.split(":");	//Subdevice data, if one, is stored into id.
			
			var ninjaRule = {
				rid : task.tpId,
				shortName : task.name,
				timeout : NB_TIMEOUT,
				preconditions : [], //need to be filled with ucondition objects
				actions : [{ 
					handler: NB_ACTIONHANDLER, 
					params: { 
						guid : deviceTpIdSplit[0],
						to : (deviceTpIdSplit.length > 1 ? deviceTpIdSplit[1] : null),
						da : task.status,
					} 
				}]
			}

			cb(ninjaRule);
		});
	});
};

UTaskSchema.plugin(cleanJson);
mongoose.model('UTask', UTaskSchema);