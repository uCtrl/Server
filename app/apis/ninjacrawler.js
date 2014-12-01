/**
 * ninjaCrawler API Library
 */

'use strict';

var _ = require('lodash'),
	util = require('util'),
	ninjablocks = require('./ninjablocks.js'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	UPlatform = mongoose.model('UPlatform'),
	UDevice = mongoose.model('UDevice'),
	UScenario = mongoose.model('UScenario'),
	UTask = mongoose.model('UTask'),
	UCondition = mongoose.model('UCondition'),
	uuid = require('node-uuid'),
	async = require('async');

/**
 * Model events listener
 * CRUD for NinjaBlocks on model's events
 */
 var defaultEvent = function() {
	console.log('--event : no NinjaBlock action to do.');
}

/*
 * User events
 */
User.on('create', defaultEvent);
User.on('update', defaultEvent);
User.on('destroy', defaultEvent);

/*
 * UPlatform events
 */
UPlatform.on('create', defaultEvent);
UPlatform.on('update', defaultEvent);
UPlatform.on('destroy', defaultEvent);

/*
 * UDevice events
 */
UDevice.on('create', defaultEvent);
UDevice.on('update', function(uCtrl_User, deviceObj, source) {
	if (source != 'ninja') {
		var nb = new ninjablocks({userAccessToken : uCtrl_User.ninjablocks.userAccessToken});
		UDevice.toNinjaBlocks(deviceObj, function(ninjaDevice){
			nb.device(ninjaDevice.guid).update(ninjaDevice, function(err, result){
				console.log('--event : NinjaBlock device ' + ninjaDevice.guid + ' updated.');
			});
		});
	}
});
UDevice.on('destroy', defaultEvent);

/*
 * UScenario events
 */
UScenario.on('create', defaultEvent);
UScenario.on('update', defaultEvent);
UScenario.on('destroy', function(uCtrl_User, scenarioObj) {
	var nb = new ninjablocks({userAccessToken : uCtrl_User.ninjablocks.userAccessToken});
	if(scenarioObj) {
		_(scenarioObj._tasks).forEach(function(taskId, taskIndex) {
			UTask.findById(taskId, function(err, taskObj) {
				UTask.emit('destroy', uCtrl_User, taskObj);
			});
		});
	}
});
UScenario.on('enable', defaultEvent);

/*
 * UTask events
 */
UTask.on('create', function(uCtrl_User, taskObj) {
	console.log('--event : NinjaBlock rule can\'t be created without preconditions. It will be created in condition create event.');
});

UTask.on('update', function(uCtrl_User, taskObj) {//TODO : review & test, conditions..etc
	var nb = new ninjablocks({userAccessToken : uCtrl_User.ninjablocks.userAccessToken});
	UTask.toNinjaBlocks(taskObj, function(ninjaRule) {
		if (taskObj.tpId) {//if NB rule doesn't exist
			nb.rule(taskObj.tpId).update(ninjaRule, function(err, result) {
				if(err) {
					console.log('--ERROR : ' + JSON.stringify(ninjaRule));
					console.log('--ERROR : ' + err);
				}
				console.log('--event : NinjaBlock rule ' + taskObj.tpId + ' updated.');
			});
		}
		else {
			nb.rule().create(ninjaRule, function(err, result) {
				if(err) {
					console.log('--ERROR : ' + JSON.stringify(ninjaRule));
					console.log('--ERROR : ' + err);
				}
				else {
					taskObj.tpId = result.data.rid
					taskObj.save(function(err) {
						if(err) console.log('--ERROR : ' + err);
						else console.log('--event : NinjaBlock rule ' + taskObj.tpId + ' created.');
					});
				}
			});
		}
	});
});

UTask.on('destroy', function(uCtrl_User, taskObj) {//TODO : review & test
	var nb = new ninjablocks({userAccessToken : uCtrl_User.ninjablocks.userAccessToken});
	nb.rule(taskObj.tpId).delete(function(err, result) {
		console.log('--event : NinjaBlock rule ' + taskObj.tpId + ' deleted.');
	});
});

/*
 * UCondition events
 */
UCondition.on('create', defaultEvent);
UCondition.on('update', defaultEvent);
UCondition.on('destroy', defaultEvent);

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
		var arrObjectsToSave = [];
		
		/**
		 * First step : Drop collections content
		 * @param  {Function} callback Callback when request finished or error found
		 */
		var dropCollections = function(callback){
			async.series([
				function(callback){
					mongoose.connection.collections['uplatforms'].drop( function(err) {
						callback(err, 'drop UPlatform done');
					});
				},
				function(callback){
					mongoose.connection.collections['udevices'].drop( function(err) {
						callback(err, 'drop UDevice done');
					});
				},
				function(callback){
					mongoose.connection.collections['uscenarios'].drop( function(err) {
						callback(err, 'drop UScenario done');
					});
				},
				function(callback){
					mongoose.connection.collections['utasks'].drop( function(err) {
						callback(err, 'drop UTask done');
					});
				},
				function(callback){
					mongoose.connection.collections['uconditions'].drop( function(err) {
						callback(err, 'drop UCondition done');
					});
				}
			], function(err, results){//err and results from all callbacks
				callback(err, results);
			});
		};
		
		/**
		 * Second step : Fetch all data from NinjaBlocks API (asynchronous calls)
		 * @param  {Function} callback Callback when request finished or error found
		 */
		var fetchData = function(callback){
			// fetch NinjaBlocks blocks
			nb.blocks( function(err, blocks) {
				self._fromNinjaBlocks.blocks = blocks;
				
				// fetch NinjaBlocks devices
				nb.devices(function(err, devices) {
					self._fromNinjaBlocks.devices = devices;
					
					// fetch NinjaBlocks rules
					nb.rules(function(err, rules) {
						self._fromNinjaBlocks.rules = rules;
						
						callback(null, 'fetch done');
					});
				});
			});
		};
		
		/**
		 * Third step : Index the data after the fetch
		 * @param  {Function} callback Callback when request finished or error found
		 */
		var indexData = function(callback){		
			// create platforms entries
			_(self._fromNinjaBlocks.blocks).forEach(function (blockObj, blockId) {
				UPlatform.fromNinjaBlocks(blockObj, blockId, function(platform) {
					platform['parentId'] = self._options.user.id;
					arrObjectsToSave.push(platform);
					// create devices under this platform
					_(self._fromNinjaBlocks.devices).forEach(function (deviceObj, deviceId) { 
						if (deviceId.split("_")[0] == platform.tpId) {
							if (deviceObj.has_subdevice_count) {
								// if it contains subdevices
								var processed_switches = [];

								_(deviceObj.subDevices).forEach(function (subdeviceObj, subdeviceId) {

									// Check if it's a on/off switch
									if (UDevice.isSwitch(subdeviceObj.data)) {
										var id = (parseInt(subdeviceObj.data,2) & 0x7).toString(2);
										// Only save the device if it's a new switch, not the counter part of one.
										if (!_.contains(processed_switches, id)){
											var device_name = /(.+)(off|on)/i.exec(subdeviceObj.shortName);
											if (device_name) {
												subdeviceObj.shortName = device_name[1] + "switch";
											}
											processed_switches.push(id);
											subdeviceObj.data = UDevice.switchOff(subdeviceObj.data);
										} else {
											return;
										}
									}

									UDevice.fromNinjaBlocks(deviceObj, deviceId, subdeviceObj, subdeviceObj.data, function(device){
										if (!device.hidden) {
											device['parentId'] = platform.id;
											arrObjectsToSave.push(device);
											// create a default scenario under this subdevice
											UScenario.createDefault(function(scenario) {
												scenario['parentId'] = device.id;
												arrObjectsToSave.push(scenario);
												// create tasks under this scenario
												_(self._fromNinjaBlocks.rules).forEach(function(ruleObj, ruleId) {
													if (ruleObj.actions[0].params.guid == deviceId && 
														UDevice.switchOff(ruleObj.actions[0].params.da) == subdeviceObj.data) {

														UTask.fromNinjaBlocks(ruleObj, ruleObj.rid, function(task){
															task['parentId'] = scenario.id;
															arrObjectsToSave.push(task);
															// create conditions under this task
															_(ruleObj.preconditions).forEach(function(preconditionObj, preconditionId) {
																UCondition.fromNinjaBlocks(preconditionObj, task.tpId + ':' + preconditionId, function(lstCondition){
																	_(lstCondition).forEach(function(condition){
																		condition['parentId'] = task.id;
																		arrObjectsToSave.push(condition);
																	});
																});
															});
														});
													}
												});
											});
										}
									});
								});
							}
							else {
							
								// if no subdevice
								UDevice.fromNinjaBlocks(deviceObj, deviceId, null, null, function(device) {
									if (!device.hidden) {
										device['parentId'] = platform.id;
										arrObjectsToSave.push(device);
										// create a default scenario under this subdevice
										UScenario.createDefault(function(scenario) {
											scenario['parentId'] = device.id;
											arrObjectsToSave.push(scenario);
											// create tasks under this scenario
											_(self._fromNinjaBlocks.rules).forEach(function(ruleObj, ruleId) {
												if (ruleObj.actions[0].params.guid == deviceId) {
													UTask.fromNinjaBlocks(ruleObj, ruleObj.rid, function(task){
														task['parentId'] = scenario.id;
														arrObjectsToSave.push(task);
														// create conditions under this task
														_(ruleObj.preconditions).forEach(function(preconditionObj, preconditionId) {
															UCondition.fromNinjaBlocks(preconditionObj, task.tpId + ':' + preconditionId, function(lstCondition){
																_(lstCondition).forEach(function(condition){
																	condition['parentId'] = task.id;
																	arrObjectsToSave.push(condition);
																});
															});
														});
													});
												}
											});
										});
									}
								});
							}
						}
					});
				});
			});
			
			callback(null, 'index done');
		};
		
		/**
		 * Fourth step : Save the data into the MongoDB database
		 * @param  {Function} callback Callback when request finished or error found
		 */
		var saveData = function(index, callback){
			arrObjectsToSave[index]["_user"] = self._options.user._id;
			arrObjectsToSave[index].save(function(err) {
				if(arrObjectsToSave[index+1] !== undefined) {
					saveData(index+1, callback);
				}
				else {
					callback(null, 'save done');
				}
			});
		};
		
		/**
		 * Fifth and final step : Binding of all the data saved into the database
		 * @param  {Function} callback Callback when request finished or error found
		 */
		var bindData = function(callback){
			async.series([
				function(callback){
					UPlatform.find({}, function(err, platforms) {
						var count = _(platforms).size();
						if (count >=1 ) {
							_(platforms).forEach(function(platformObj) {
								User.findOne({ id : platformObj.parentId }, function(err, userObj) {
									if (userObj) {
										platformObj['_user'] = userObj._id;
										platformObj.save(function(err){
											count--;
											if (count==0) callback(null, 'bind platforms done');
										});
									}
								});
							});
						}
						else callback(null, 'bind platforms done');
					});
				},
				function(callback){
					UDevice.find({}, function(err, devices) {
						var count = _(devices).size();
						if (count >=1 ) {
							_(devices).forEach(function(deviceObj) {
								UPlatform.findOne({ id : deviceObj.parentId }, function(err, platformObj) {
									if (platformObj) {
										deviceObj['_platform'] = platformObj._id;
										deviceObj.save(function(err){
											count--;
											if (count==0) callback(null, 'bind devices done');
										});
									}
								});
							});
						}
						else callback(null, 'bind devices done');
					});
				},
				function(callback){
					UScenario.find({}, function(err, scenarios) {
						var count = _(scenarios).size();
						if (count >=1 ) {
							_(scenarios).forEach(function(scenarioObj) {
								UDevice.findOne({ id : scenarioObj.parentId }, function(err, deviceObj) {
									if (deviceObj) {
										scenarioObj['_device'] = deviceObj._id;
										scenarioObj.save(function(err){
											count--;
											if (count==0) callback(null, 'bind scenarios done');
										});
									}
								});
							});
						}
						else callback(null, 'bind scenarios done');
					});
				},
				function(callback){
					UTask.find({}, function(err, tasks) {
						var count = _(tasks).size();
						if (count >=1 ) {
							_(tasks).forEach(function(taskObj) {
								UScenario.findOne({ id : taskObj.parentId }, function(err, scenarioObj) {
									if (scenarioObj) {
										if (UDevice.isSwitch(taskObj.value)) {
											taskObj.value = UDevice.switchValue(taskObj.value);
										}

										taskObj['_scenario'] = scenarioObj._id;
										taskObj.save(function(err){
											count--;
											if (count==0) callback(null, 'bind tasks done');
										});
									}
								});
							});
						}
						else callback(null, 'bind tasks done');
					});
				},
				function(callback){
					UTask.find({}, function(err, tasks) {
						var count = _(tasks).size();
						if (count >=1 ) {
							_(tasks).forEach(function(taskObj) {
								UScenario.findOne({ id : taskObj.parentId }, function(err, scenarioObj) {
									if (scenarioObj) {
										UDevice.findOne({ id : scenarioObj.parentId }, function(err, deviceObj) {
											if (deviceObj) {
												taskObj.value = UDevice.fromSpecialCase(deviceObj.tpId, deviceObj.type, taskObj.value);
												taskObj.save(function(err){
													count--;
													if (count==0) callback(null, 'bind tasks special cases done');
												});
											}
										});
									}
								});
							});
						}
						else callback(null, 'bind tasks special cases done');
					});
				},
				function(callback){
					UCondition.find({}, function(err, conditions) {
						var count = _(conditions).size();
						if (count >=1 ) {
							_(conditions).forEach(function(conditionObj) {
								UTask.findOne({ id : conditionObj.parentId }, function(err, taskObj) {
									if (taskObj) {
										conditionObj['_task'] = taskObj._id;
										conditionObj.save(function(err){
											count--;
											if (count==0) callback(null, 'bind conditions step 1 done');
										});
									}
								});
							});
						}
						else callback(null, 'bind conditions step 1 done');
					});
				},
				function(callback){
					UCondition.find({}, function(err, conditions) {
						var count = _(conditions).size();
						if (count >=1 ) {
							_(conditions).forEach(function(conditionObj) {

								if (conditionObj.deviceTpId) { // if condition type is Device...

									// if condition is on a switch subdevice
									if (UDevice.isSwitch(conditionObj.beginValue)) {
										var m = /(.*):(.*)/g.exec(conditionObj.deviceTpId);

										if (m) {
											var RFID = m[1];
											var switchID = m[2];
											var newTpId = RFID + ':' + UDevice.switchOff(switchID);

											UDevice.findOne({ tpId : newTpId }, function(err, deviceObj) {
												if (deviceObj) {
													conditionObj.deviceId = deviceObj.id;
													conditionObj.beginValue = UDevice.switchValue(conditionObj.beginValue);
													conditionObj.deviceTpId = deviceObj.tpId;
													conditionObj.save(function(err){
														count--;
														if (count==0) callback(null, 'bind condition step 2 done');
													});
												}
											});
										} else {
											console.log("supposed to be a switch, but I cannot find the switch ID format...");
											count--;
											if (count==0) callback(null, 'bind condition step 2 done');
										}

									} else {
										UDevice.findOne({ tpId : conditionObj.deviceTpId }, function(err, deviceObj) {
											if (deviceObj) {
												conditionObj.deviceId = deviceObj.id;
												conditionObj.save(function(err){
													count--;
													if (count==0) callback(null, 'bind condition step 2 done');
												});
											}
										});
									}
								}
							});
						}
						else callback(null, 'bind condition step 2 done');
					});
				}				
			], function(err, results){//err and results from all callbacks
				callback(err, results);
			});
		};
	
		/**
		 * Doing the drop, fetch, index, save and bind functions synchronously
		 */
		dropCollections(function(err, done){
			var results;
			results += done;
			fetchData(function(err, done){
				results += done;
				indexData(function(err, done){
					results += done;
					saveData(0, function(err, done){
						results += done;
						bindData(function(err, done){
							results += done;
							callback(err, results);
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