// The rules engine from NinjaBlocks is experimental.
'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	cleanJson = require('./cleanJson.js'),
	_ = require('lodash'),
	async = require('async'),
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
	parentId: String,
	tpId: String,
	name: String,
	value: String,
	enabled: Boolean,
	lastUpdated: Number,
	_scenario: {
		type: Schema.Types.ObjectId,
		ref: 'UScenario'
	},
	_user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	_conditions: [
		{
			type: Schema.Types.ObjectId,
			ref: 'UCondition'
		}
	]
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
		function (err) {
			if (err) console.log('Error: ', err);
		});
});

// Can't use middleware on findAndUpdate functions

UTaskSchema.post('remove', function (task) {
	var UScenario = mongoose.model('UScenario'),
		UCondition = mongoose.model('UCondition');

	UScenario.update(
		{ _id: task._scenario },
		{ $pull: { _tasks: task._id } },
		{ safe: true },
		function (err) {
			if (err) console.log('Error: ', err);
		});

	UCondition.find({ _id: { $in: task._conditions } }, function (err, conditions) {
		if (err) {
			console.log('Error: ', err);
			return;
		}
		_(conditions).forEach(function (condition) {
			condition.remove();
		});
	});
});

/*
 * Receives the block (from NB) and will call the cb when mapped.
 * To logic here is only to do the mapping
 */
UTaskSchema.statics.fromNinjaBlocks = function (ninjaRule, ninjaRuleId, cb) {
	var UTask = mongoose.model('UTask');

	// Mapping Ninja to uCtrl
	// Limited to only one action by task when mapping to µCtrl.
	var task = new UTask({
		id: uuid.v1(),
		tpId: ninjaRuleId,
		name: ninjaRule.shortName,
		value: _(ninjaRule.actions).first().params.da !== undefined ? _(ninjaRule.actions).first().params.da : null,
		enabled: !ninjaRule.suspended,
		lastUpdated: null
	});
	cb(task);
};

/*
 * Receives the task (from MongoDB) and will call the cb when mapped
 * To logic here is only to do the mapping
 */
UTaskSchema.statics.toNinjaBlocks = function (task, cb) {
	var UScenario = mongoose.model('UScenario'),
		UDevice = mongoose.model('UDevice'),
		UCondition = mongoose.model('UCondition'),
		NB_ACTIONHANDLER = 'ninjaSendCommand',
		NB_TIMEOUT = 2;

	var ninjaRule = {
		rid: task.tpId,
		shortName: task.id,
		timeout: NB_TIMEOUT,
		preconditions: [],//filled below if any
		actions: [
			{
				handler: NB_ACTIONHANDLER,
				params: {
					guid: null,//mapped below
					da: task.value,
					shortName: task.value
				}
			}
		]
	};

	UScenario.findById(task._scenario, function (err, scenario) {
		UDevice.findById(scenario._device, function (err, device) {
			var deviceTpIdSplit = device.tpId.split(':');//subdevice data, if one, is stored into id.
			ninjaRule.actions[0].params.guid = deviceTpIdSplit[0];
			ninjaRule.actions[0].params.da = UDevice.toSpecialCase(device.tpId, device.type, task.value);

			//mapping conditions here
			//all times preconditions for a rule need to be mapped in only one precondition
			UCondition.find({_task: task._id}, function (err, conditions) {
				var conditionsSize = conditions.length;

				if (conditionsSize >= 1) {
					var dayCondition = null;
					var timeCondition = null;
					var lstDeviceCondition = [];

					_(conditions).forEach(function (conditionObj) {
						switch (conditionObj.type) {
							case 2 ://day
								dayCondition = conditionObj;
								break;
							case 3 ://time
								timeCondition = conditionObj;
								break;
							case 4 ://device
								lstDeviceCondition.push(conditionObj);
								break;
							case -1 : //none
							case 1 : //date
							default: //others
								break;
						}
					});

					async.series([
						function (callback) {
							if (lstDeviceCondition.length >= 1) {
								async.forEach(lstDeviceCondition, function (deviceConditionObj, callback) {
									UCondition.toNinjaBlocks(deviceConditionObj, function (ninjaPrecondition) {
										ninjaRule.preconditions.push(ninjaPrecondition);
										callback();
									});
								}, function () {
									callback();
								});

							}
							else callback();
						},
						function (callback) {
							if (dayCondition && timeCondition) {
								var days = parseInt(dayCondition.beginValue);
								var times = [];
								UCondition.toNinjaBlocks(timeCondition, function (ninjaPrecondition) {
									for (var i = 0; i <= 6; i++) {
										if (days & Math.pow(2, i)) {
											times.push(ninjaPrecondition.params.times[(i * 2)]);
											times.push(ninjaPrecondition.params.times[(i * 2) + 1]);
										}
									}
									ninjaPrecondition.params.times = times;
									ninjaRule.preconditions.push(ninjaPrecondition);
									callback();
								});
							}
							else if (dayCondition) {
								UCondition.toNinjaBlocks(dayCondition, function (ninjaPrecondition) {
									ninjaRule.preconditions.push(ninjaPrecondition);
									callback();
								});
							}
							else if (timeCondition) {
								UCondition.toNinjaBlocks(timeCondition, function (ninjaPrecondition) {
									ninjaRule.preconditions.push(ninjaPrecondition);
									callback();
								});
							}
							else callback();
						}
					], function () {
						cb(ninjaRule);
					});
				}
			});
		});
	});
};

UTaskSchema.plugin(cleanJson);
mongoose.model('UTask', UTaskSchema);