'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var ninjaBlocks = require(__base + 'app/apis/ninjablocks.js');
var ninja = new ninjaBlocks( {userAccessToken:global.uctrl.ninja.userAccessToken} );

/**
 * UCondition Schema
 */
var UConditionSchema = new mongoose.Schema({
	id				: Number,
	type			: Number,
	beginValue		: Number,
	endValue		: Number,
	beginDate		: Date,
	endDate			: Date,
	beginTime		: Date,
	endTime			: Date,
	comparisonType	: Number,
	deviceId		: Number,
	deviceType		: Number,
	/*TODO*/
	equality		: String,
	handler			: String,
	to				: String,
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
	
	/**
	* fromNinjaBlocks
	* https://github.com/ninjablocks/ninjablocks.github.com/wiki/Rules-Engine-Documentation
	*/
	fromNinjaBlocks: {
		/**
		 * all
		 *
		 * @param {Function} cb
		 * @api public
		 */
		all: function(req, cb) {
			var ucondition = mongoose.model('UCondition');
			var UECONDITIONTYPE = {
				None : -1,
				Date : 1,
				Day : 2,
				Time : 3,
				Device : 4
			};
			var UECOMPARISONTYPE = {
				None : 0,
				GreaterThan : 0x1,
				LesserThan : 0x2,
				Equals : 0x4,
				InBetween : 0x8,
				Not : 0x16
			};
			ninja.rules(function(err, arrRules){
				var out = [];
				arrRules.forEach(function(ruleObj, ruleIndex){
					if(ruleObj.rid == req.params.taskId){
						ruleObj.preconditions.forEach(function(precondObj, precondIndex){
							var obj = new ucondition({
								id				: null,
								type			: UECONDITIONTYPE.Device,		//TODO
								beginValue		: precondObj.params.value,
								endValue		: precondObj.params.value,
								beginDate		: null,
								endDate			: null,
								beginTime		: null,
								endTime			: null,
								comparisonType	: UECOMPARISONTYPE.GreaterThan, //TODO
								deviceId		: precondObj.params.guid,
								deviceType		: null,
								/*TODO*/
								equality		: precondObj.params.equality,	//TODO
								handler			: precondObj.handler,			//TODO
								to				: precondObj.params.to,			//TODO
							});
							out.push(obj);
						});
					}
				});
				return cb(out);
			});
		},
		
		/**
		 * show
		 *
		 * @param {Function} cb
		 * @api public
		 */
		show: function(req, cb) {
			return "Ninja preconditions don't have ids.";	//TODO
		},
    },
}

mongoose.model('UCondition', UConditionSchema);