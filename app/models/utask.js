'use strict';

require(__dirname + '/ucondition.js');
var mongoose = require('mongoose');

/**
 * UTask Schema
 */
var UTaskSchema 	= new mongoose.Schema({
	id				: Number,
	status			: String,
	conditions		: [mongoose.model('UCondition').schema],
});

/**
 * Statics
 */
UTaskSchema.statics = {

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
							return cb(scenarioObj.tasks);
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
									return cb(taskObj);
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
		var utask = this;
		var uplatform = mongoose.model('UPlatform');
		uplatform.findOne({id : req.params.platformId}, function(err, platformObj){
			platformObj.devices.forEach(function(deviceObj, deviceIndex){
				if(deviceObj.id == req.params.deviceId){
					deviceObj.scenarios.forEach(function(scenarioObj, scenarioIndex){
						if(scenarioObj.id == req.params.scenarioId){
							var obj = new utask(req.body);
							platformObj.devices[deviceIndex].scenarios[scenarioIndex].tasks.push(obj);
							platformObj.save();
							return cb("created");
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
									platformObj.devices[deviceIndex].scenarios[scenarioIndex].tasks.remove(taskObj._id.toString());
									platformObj.save();
									return cb("destroyed");
								}
							});
						}
					});
				}
			});
		});
	},
}

mongoose.model('UTask', UTaskSchema);