'use strict';

var mongoose = require('mongoose');

/**
 * UCondition Schema
 */
var UConditionSchema = new mongoose.Schema({
	id				: Number,
	type			: Number,
	beginValue		: Number,
	comparisonType	: Number,
	deviceId		: Number,
	deviceType		: Number,
	endValue		: Number,
});

/**
 * Statics
 */
UConditionSchema.statics = {

	/**
	* All
	*
	* @param {Object} req
	* @param {Function} cb callback
	*/
	all: function (req, cb) {
		var uplatform = mongoose.model('UPlatform');
		uplatform.findOne({id : req.params.platformId}, function(err, platformObj){
			platformObj.devices.forEach(function(deviceObj, deviceIndex){
				if(deviceObj.id == req.params.deviceId){
					deviceObj.scenarios.forEach(function(scenarioObj, scenarioIndex){
						if(scenarioObj.id == req.params.scenarioId){
							scenarioObj.tasks.forEach(function(taskObj, taskIndex){
								if(taskObj.id == req.params.taskId){
									return cb(taskObj.conditions);
								}
							});
						}
					});
				}
			});
		});
	},
	
	/**
	* Show
	*
	* @param {Object} req
	* @param {Function} cb callback
	*/
	show: function (req, cb) {
		var uplatform = mongoose.model('UPlatform');
		uplatform.findOne({id : req.params.platformId}, function(err, platformObj){
			platformObj.devices.forEach(function(deviceObj, deviceIndex){
				if(deviceObj.id == req.params.deviceId){
					deviceObj.scenarios.forEach(function(scenarioObj, scenarioIndex){
						if(scenarioObj.id == req.params.scenarioId){
							scenarioObj.tasks.forEach(function(taskObj, taskIndex){
								if(taskObj.id == req.params.taskId){
									taskObj.conditions.forEach(function(conditionObj, conditionIndex){
										if(conditionObj.id == req.params.conditionId){
											return cb(conditionObj);
										}
									});
								}
							});
						}
					});
				}
			});
		});
	},
	
	/**
	* Create
	*
	* @param {Object} req
	* @param {Function} cb callback
	*/
	create: function (req, cb) {
		var ucondition = this;
		var uplatform = mongoose.model('UPlatform');
		uplatform.findOne({id : req.params.platformId}, function(err, platformObj){
			platformObj.devices.forEach(function(deviceObj, deviceIndex){
				if(deviceObj.id == req.params.deviceId){
					deviceObj.scenarios.forEach(function(scenarioObj, scenarioIndex){
						if(scenarioObj.id == req.params.scenarioId){
							deviceObj.scenarios.forEach(function(scenarioObj, scenarioIndex){
								if(scenarioObj.id == req.params.scenarioId){
									scenarioObj.tasks.forEach(function(taskObj, taskIndex){
										if(taskObj.id == req.params.taskId){
											var obj = new ucondition(req.body);
											platformObj.devices[deviceIndex].scenarios[scenarioIndex].tasks[taskIndex].conditions.push(obj);
											platformObj.save();
											return cb("created");
										}
									});
								}
							});
						}
					});
				}
			});
		});
	},
	
	/**
	* Update
	*
	* @param {Object} req
	* @param {Function} cb callback
	*/
	update: function (req, cb) {
		var uplatform = mongoose.model('UPlatform');
		return cb("TODO");
	},
	
	/**
	* Destroy
	*
	* @param {Object} req
	* @param {Function} cb callback
	*/
	destroy: function (req, cb) {
		var uplatform = mongoose.model('UPlatform');
		uplatform.findOne({id : req.params.platformId}, function(err, platformObj){
			platformObj.devices.forEach(function(deviceObj, deviceIndex){
				if(deviceObj.id == req.params.deviceId){
					deviceObj.scenarios.forEach(function(scenarioObj, scenarioIndex){
						if(scenarioObj.id == req.params.scenarioId){
							scenarioObj.tasks.forEach(function(taskObj, taskIndex){
								if(taskObj.id == req.params.taskId){
									taskObj.conditions.forEach(function(conditionObj, conditionIndex){
										if(conditionObj.id == req.params.conditionId){
											platformObj.devices[deviceIndex].scenarios[scenarioIndex].tasks[taskIndex].conditions.remove(conditionObj._id.toString());
											platformObj.save();
											return cb("destroyed");
										}
									});
								}
							});
						}
					});
				}
			});
		});
	},
}

mongoose.model('UCondition', UConditionSchema);