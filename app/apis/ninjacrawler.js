/**
 * ninjaCrawler API Library
 */

'use strict';

var request = require('request'),
	_ = require('lodash'),
	util = require('util'),
	ninjablocks = require('./ninjablocks.js'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	UPlatform = mongoose.model('UPlatform'),
	UDevice = mongoose.model('UDevice'),
	UScenario = mongoose.model('UScenario'),
	UTask = mongoose.model('UTask'),
	UCondition = mongoose.model('UCondition'),
	uuid = require('node-uuid');

/**
 * Model events listener
 * CRUD for NinjaBlocks on model's events
	 * ref : http://grokbase.com/t/gg/mongoose-orm/1235c1mjsq/mongoose-emitting-an-event-in-a-middleware-function
	 * use:
			MyModel.on('new', function(mymodel) {
				io.sockets.emit('new_my_model', mymodel.toJSON());
			});
 */
 var defaultEvent = function() {
	console.log('--event : no NinjaBlock action to do.');
}

/*
 * User events
 */
User.on('create', function() {
	console.log('--event : no NinjaBlock action to do.');
});
User.on('update', function() {
	console.log('--event : no NinjaBlock action to do.');
});
User.on('destroy', function() {
	console.log('--event : no NinjaBlock action to do.');
});

/*
 * UPlatform events
 */
UPlatform.on('create', function() {
	//TODO : pair block and delete all devices and rules related.
	console.log('--event : TODO : pair block and delete all devices and rules related.');
});
UPlatform.on('update', function() {
	console.log('--event : no NinjaBlock action to do.');
});
UPlatform.on('destroy', function() {
	//TODO : unpair block and delete all devices and rules related.
		console.log('--event : TODO : unpair block and delete all devices and rules related.');
});
/*
 * UDevice events
 */
UDevice.on('create', function(deviceObj) {
	var nb = new ninjablocks({userAccessToken : '107f6f460bed2dbb10f0a93b994deea7fe07dad5'});
	UDevice.toNinjaBlocks(deviceObj, function(ninjaDevice, ninjaSubdevice){
		if (ninjaSubdevice != null) { //If it's a subdevice
			nb.device(ninjaDevice.guid).subdevice().create(ninjaSubdevice, function(err, result){
				console.log('--event : NinjaBlock subdevice created.');
				//TODO : chande subdevice tpId with the one provided.
			});
		}
		else {
			console.log('--event : Can\'t create a new NinjaBlock device.'); //
		}
	});
});

UDevice.on('update', function(deviceObj) {
	var nb = new ninjablocks({userAccessToken : '107f6f460bed2dbb10f0a93b994deea7fe07dad5'});
	UDevice.toNinjaBlocks(deviceObj, function(ninjaDevice, ninjaSubdevice){
		if (ninjaSubdevice != null) { //If it's a subdevice
			console.log('--event : TODO : subdevice update with the subdevice tpId.');
			/* TODO : subdevice update with the subdevice tpId
			nb.device(ninjaDevice.guid).subdevice([TODO : subdevice]).update(ninjaSubdevice, function(err, result){
				console.log('--event : NinjaBlock subdevice updated.');
			});
			*/
		}
		else {
			nb.device(ninjaDevice.guid).update(ninjaDevice, function(err, result){
				console.log('--event : NinjaBlock device ' + ninjaDevice.guid + ' updated.');
			});
		}
	});
});

UDevice.on('destroy', function(deviceObj) {
	var nb = new ninjablocks({userAccessToken : '107f6f460bed2dbb10f0a93b994deea7fe07dad5'});
	UDevice.toNinjaBlocks(deviceObj, function(ninjaDevice, ninjaSubdevice){
		if (ninjaSubdevice != null) { //If it's a subdevice
			console.log('--event : TODO : subdevice delete with the subdevice tpId.');
			/* TODO : subdevice delete with the subdevice tpId
			nb.device(ninjaDevice.guid).subdevice([TODO : subdeviceid]).delete(function(err, result){
				console.log('--event : NinjaBlock subdevice deleted.');
			});
			*/
		}
		else {
			nb.device(ninjaDevice.guid).delete(function(err, result){
				console.log('--event : NinjaBlock device ' + ninjaDevice.guid + ' deleted.');
			});
		}
	});
	
	_(deviceObj._scenarios).forEach(function(scenarioId, scenarioIndex) {
		UScenario.findById(scenarioId, function(err, scenarioObj) {
			UScenario.emit('destroy', scenario); //event to delete all children (rules from scenarios)
		});
	});
});

/*
 * UScenario events
 */
UScenario.on('create', defaultEvent);
UScenario.on('update', defaultEvent);
UScenario.on('destroy', function(scenarioObj) {
	var nb = new ninjablocks({userAccessToken : '107f6f460bed2dbb10f0a93b994deea7fe07dad5'});
	_(scenarioObj._tasks).forEach(function(taskId, taskIndex) {
		UTask.findById(taskId, function(err, taskObj) {
			nb.rule(taskObj.tpId).delete(function(err, result) {
				console.log('--event : NinjaBlock rule ' + taskObj.tpId + ' deleted.');
			});
		});
	});
	//no children to delete (rules from this scenario are deleted)
});

/*
 * UTask events
 */
UTask.on('create', function(taskObj) {
	var nb = new ninjablocks({userAccessToken : '107f6f460bed2dbb10f0a93b994deea7fe07dad5'});
	UTask.toNinjaBlocks(taskObj, function(ninjaRule) {
		nb.rule(taskObj.tpId).create(ninjaRule, function(err, result) {
			//TODO : chande task tpId with the one provided.
			console.log('--event : NinjaBlock rule ' + taskObj.tpId + ' created.');
		});
	});
});

UTask.on('update', function(taskObj) {
	var nb = new ninjablocks({userAccessToken : '107f6f460bed2dbb10f0a93b994deea7fe07dad5'});
	UTask.toNinjaBlocks(taskObj, function(ninjaRule) {
		nb.rule(taskObj.tpId).update(ninjaRule, function(err, result) {
			console.log('--event : NinjaBlock rule ' + taskObj.tpId + ' updated.');
		});
	});
});

UTask.on('destroy', function(taskObj) {
	var nb = new ninjablocks({userAccessToken : '107f6f460bed2dbb10f0a93b994deea7fe07dad5'});
	nb.rule(taskObj.tpId).delete(function(err, result) {
		console.log('--event : NinjaBlock rule ' + taskObj.tpId + ' deleted.');
	});
	//no children to delete (preconditions are in rules)
});

/*
 * UCondition events
 */
UCondition.on('create', function(conditionObj) {
	var nb = new ninjablocks({userAccessToken : '107f6f460bed2dbb10f0a93b994deea7fe07dad5'});
	UTask.findById(conditionObj._task, function(err, taskObj) {
		UTask.toNinjaBlocks(taskObj, function(ninjaRule){
			//TODO : chande condition tpId with the new index.
			UCondition.toNinjaBlocks(conditionObj, function(ninjaPrecondition) {
				ninjaRule.preconditions.push(ninjaPrecondition); //add the precondition
				nb.rule(taskObj.tpId).update(ninjaRule, function(err, result) {
					console.log('--event : NinjaBlock rule ' + taskObj.tpId + ' updated.');
				});
			});
		});
	});
});

UCondition.on('update', function(conditionObj) {
	var nb = new ninjablocks({userAccessToken : '107f6f460bed2dbb10f0a93b994deea7fe07dad5'});
	UTask.findById(conditionObj._task, function(err, taskObj) {
		UTask.toNinjaBlocks(taskObj, function(ninjaRule){
			var conditionTpIdSplit = conditionObj.tpId.split(":"); //precondition index stored into tpId.
			var preconditionIndex = conditionTpIdSplit[1];
			UCondition.toNinjaBlocks(conditionObj, function(ninjaPrecondition) {
				ninjaRule.preconditions[preconditionIndex] = ninjaPrecondition; //update the precondition
				nb.rule(taskObj.tpId).update(ninjaRule, function(err, result) {
					console.log('--event : NinjaBlock rule ' + taskObj.tpId + ' updated.');
				});
			});
		});
	});
});

UCondition.on('destroy', function(conditionObj) {
	var nb = new ninjablocks({userAccessToken : '107f6f460bed2dbb10f0a93b994deea7fe07dad5'});
	UTask.findById(conditionObj._task, function(err, taskObj) {
		UTask.toNinjaBlocks(taskObj, function(ninjaRule){
			var conditionTpIdSplit = conditionObj.tpId.split(":"); //precondition index stored into tpId.
			var preconditionIndex = conditionTpIdSplit[1];
			ninjaRule.preconditions.splice(preconditionIndex, 1); //remove the precondition from the rule
			nb.rule(taskObj.tpId).update(ninjaRule, function(err, result) {
				console.log('--event : NinjaBlock rule ' + taskObj.tpId + ' updated.');
			});
		});
	});
	//no children to delete
});

/*
 * NinjaCrawler
 */
function ninjaCrawler(options) {
	var self = this;
	this._options = options || {};
	this._fromNinjaBlocks = {
		blocks : [],
		devices : [],
		rules : [],
	};
	var nb = new ninjablocks({userAccessToken : self._options.userAccessToken});
	
	/**
	 * Fetch all data from NinjaBlocks API (asynchronous calls)
	 * @param  {Function} callback Callback when request finished or error found
	 */
	this.fetchAll = function(callback) {

		// fetch NinjaBlocks blocks
		nb.blocks( function(err, blocks) {
			self._fromNinjaBlocks.blocks = blocks;
			
			// fetch NinjaBlocks devices
			nb.devices(function(err, devices) {
				self._fromNinjaBlocks.devices = devices;
				
				// fetch NinjaBlocks rules
				nb.rules(function(err, rules) {
					self._fromNinjaBlocks.rules = rules;
					
					// map ninjaBlock data to µCtrl and save them to database
					saveData();
					// callback after asynchronous calls
					callback(err);
				});
			});
		});
		
		/**
		 * Mapping of data after the fetch
		 * @param  {Function} callback Callback when request finished or error found
		 */
		var saveData = function(){
			// create platforms entries
			_(self._fromNinjaBlocks.blocks).forEach(function (blockObj, blockId)  {
				UPlatform.fromNinjaBlocks(blockObj, blockId, function(platform){
					platform.save();

					// create devices under this platform
					_(self._fromNinjaBlocks.devices).forEach(function (deviceObj, deviceId)  { 
						if (deviceId.split("_")[0] == platform.tpId) {
							if (deviceObj.has_subdevice_count >= 1) {
								
								// if it contains subdevices
								_(deviceObj.subDevices).forEach(function (subdeviceObj, subdeviceId)  { 			
									UDevice.fromNinjaBlocks(deviceObj, deviceId, subdeviceObj, subdeviceObj.data, function(device){
										device['_platform'] = platform._id;
										device.save();
										
										// create a default scenario under this subdevice
										/*
										var scenario = new UScenario({
											id : uuid.v1(),
											tpId : null, 
											name : 'Default scenario',
											enabled : true,
											lastUpdated : null,
										});
										*/
										UScenario.createDefault(function(scenario) {
											scenario['_device'] = device._id;
											scenario.save();
											
											// create tasks under this scenario
											_(self._fromNinjaBlocks.rules).forEach(function(ruleObj, ruleId)  {
												if (ruleObj.actions[0].params.guid == deviceId && ruleObj.actions[0].params.to == subdeviceObj.data) {
													UTask.fromNinjaBlocks(ruleObj, ruleObj.rid, function(task){
														task['_scenario'] = scenario._id;
														task.save();

														// create conditions under this t
														
														ask
														_(ruleObj.preconditions).forEach(function(preconditionObj, preconditionId)  {						
															UCondition.fromNinjaBlocks(preconditionObj, task.tpId + ':' + preconditionId, function(condition){
																condition['_task'] = task._id;
																condition.save();
															});
														});
													});
												}
											});
										});
									});
								});
							}
							
							else {
							
								// if no subdevices
								UDevice.fromNinjaBlocks(deviceObj, deviceId, null, null, function(device){
									device['_platform'] = platform._id;
									device.save();
									
										/*
										var scenario = new UScenario({
											id : uuid.v1(),
											tpId : null, 
											name : 'Default scenario',
											enabled : true,
											lastUpdated : null,
										});
										*/
										
									UScenario.createDefault(function(scenario) {
										scenario['_device'] = device._id;
										scenario.save();
											
										// create rules under this scenario
										_(self._fromNinjaBlocks.rules).forEach(function(ruleObj, ruleId)  {
											if (ruleObj.actions[0].params.guid == deviceId) {
												UTask.fromNinjaBlocks(ruleObj, ruleObj.rid, function(task){
													task['_scenario'] = scenario._id;
													task.save();
													
													// create conditions under this task
													_(ruleObj.preconditions).forEach(function(preconditionObj, preconditionId)  {						
														UCondition.fromNinjaBlocks(preconditionObj, task.tpId + ':' + preconditionId, function(condition){
															condition['_task'] = task._id;
															condition.save();
														});
													});
												});
											}
										});
									});
								});
							}
						}
					});
				});
			});
		};
	};
	
	/**
	 * Push all data to NinjaBlocks (asynchronous calls)
	 * Can't do a callback
	 */
	this.pushAll = function() {
		// map platforms to NinjaBlocks blocks
		UPlatform.find({}, function(err, platforms) {
			_(platforms).forEach(function(platformObj, platformIndex){
				UPlatform.toNinjaBlocks(platformObj, function(ninjaBlock){
					// TODO : claim any block at this time ?
				});
			});
		});
		
		// map and push devices to NinjaBlocks devices and subdevices
		UDevice.find({}, function(err, devices) {
			_(devices).forEach(function(deviceObj, deviceIndex){
				UDevice.toNinjaBlocks(deviceObj, function(ninjaDevice, ninjaSubdevice){
					// update devices infos (automatically created)
					nb.device(ninjaDevice.guid).update(ninjaDevice, function(err, result){
						if (ninjaSubdevice != null) {
							// create subdevices if any
							nb.device(ninjaDevice.guid).subdevice().create(ninjaSubdevice, function(err, result){
								console.log(err);
								console.log(result);
							});
						}
					});
				});
			});
		});
		
		// map actives scenarios only (and their tasks and conditions) to NinjaBlocks rules
		UScenario.find({ enabled : true }, function(err, scenarios) {
			_(scenarios).forEach(function(scenarioObj, scenarioIndex){
				_(scenarioObj._tasks).forEach(function(taskId, taskIndex){
					UTask.findById(taskId, function(err, taskObj){
						UTask.toNinjaBlocks(taskObj, function(ninjaRule){
							// map preconditions for this rule.
							// problem with asynchronous calls solved this way
							UCondition.find({ _id: { $in: taskObj._conditions } }, function(err, conditions) {
								_(conditions).forEach(function(conditionObj) {
									UCondition.toNinjaBlocks(conditionObj, function(ninjaPrecondition){
										//console.log(ninjaPrecondition);
										ninjaRule.preconditions.push(ninjaPrecondition);
									});
								});
								// rule fully mapped
								// rules can be created before the device (asynchronous)
								//console.log(ninjaRule);
								nb.rule().create(ninjaRule, function(err, result){
									console.log(err);
									console.log(result);
								});
							});
						});
					});
				});
			});
		});
	};
};


/**
 * Exports ninjaCrawler object
 * @type ninjaCrawler
 */
module.exports = ninjaCrawler;