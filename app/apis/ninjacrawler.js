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
UPlatform.on('create', defaultEvent);//TODO : pair block?
UPlatform.on('update', defaultEvent);
UPlatform.on('destroy', defaultEvent);//TODO : unpair block and delete all devices and rules related?

/*
 * UDevice events
 */
//TODO : review & test.. add if(uCtrl_User)
UDevice.on('create', function(uCtrl_User, deviceObj) {
	var nb = new ninjablocks({userAccessToken : uCtrl_User.ninjablocks.userAccessToken});
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

//TODO : review & test
UDevice.on('update', function(uCtrl_User, deviceObj) {
	var nb = new ninjablocks({userAccessToken : uCtrl_User.ninjablocks.userAccessToken});
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

//TODO : review & test
UDevice.on('destroy', function(uCtrl_User, deviceObj) {
	var nb = new ninjablocks({userAccessToken : uCtrl_User.ninjablocks.userAccessToken});
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
	//event to delete children (rules from scenarios)
	_(deviceObj._scenarios).forEach(function(scenarioId, scenarioIndex) {
		UScenario.findById(scenarioId, function(err, scenarioObj) {
			UScenario.emit('destroy', scenario);
		});
	});
});

/*
 * UScenario events
 */
//TODO : review & test
UScenario.on('create', defaultEvent);
UScenario.on('update', defaultEvent);
UScenario.on('destroy', function(uCtrl_User, scenarioObj) {
	var nb = new ninjablocks({userAccessToken : uCtrl_User.ninjablocks.userAccessToken});
	_(scenarioObj._tasks).forEach(function(taskId, taskIndex) {
		UTask.findById(taskId, function(err, taskObj) {
			nb.rule(taskObj.tpId).delete(function(err, result) {
				console.log('--event : NinjaBlock rule ' + taskObj.tpId + ' deleted.');
			});
		});
	});//no children to delete (rules from this scenario are deleted)
});
UScenario.on('enable', function(uCtrl_User, scenarioObj) {
	var nb = new ninjablocks({userAccessToken : uCtrl_User.ninjablocks.userAccessToken});
	//delete NB rules from the last active scenario(s)
	_(scenarioObj._device._scenarios).forEach(function(scenarioId, scenarioIndex) {
		UScenario.findById(scenarioId, function(err, scenarioObjToWork) {
			_(scenarioObjToWork._tasks).forEach(function(taskId, taskIndex) {
				UTask.findById(taskId, function(err, taskObj) {
					UTask.emit('destroy', uCtrl_User, taskObj);
				});
			});
		});
	});
	//create NB rules for the current active scenario
	_(scenarioObj._tasks).forEach(function(taskId, taskIndex) {
		UTask.findById(taskId, function(err, taskObj) {
			//TODO : CHANDE TASK TPID WITH THE ONE PROVIDED.
			UTask.emit('create', uCtrl_User, taskObj);
		});
	});
});

/*
 * UTask events
 */
UTask.on('create', function(uCtrl_User, taskObj) {
	console.log('--event : NinjaBlock rule can\'t be created without preconditions. It will be created in condition create event.');
});

UTask.on('update', function(uCtrl_User, taskObj) {//TODO : review & test, conditions..etc
	var nb = new ninjablocks({userAccessToken : uCtrl_User.ninjablocks.userAccessToken});
	UTask.toNinjaBlocks(taskObj, function(ninjaRule) {
		console.log('TEST' + JSON.stringify(ninjaRule));
		if (taskObj.tpId != undefined) {
			nb.rule(taskObj.tpId).update(ninjaRule, function(err, result) {
				console.log('--event : NinjaBlock rule ' + taskObj.tpId + ' updated.');
			});
		}
		else {
			nb.rule().create(ninjaRule, function(err, result) {
				if(err) console.log('--ERROR : ' + err);
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
UCondition.on('create', function(uCtrl_User, conditionObj) {
	UTask.findById(conditionObj._task, function(err, taskObj) {
		UTask.emit('update', uCtrl_User, taskObj);
	});
});

UCondition.on('update', function(uCtrl_User, conditionObj) {
	UTask.findById(conditionObj._task, function(err, taskObj) {
		UTask.emit('update', uCtrl_User, taskObj);
	});
});

UCondition.on('destroy', function(uCtrl_User, conditionObj) {
	UTask.findById(conditionObj._task, function(err, taskObj) {
		UTask.emit('update', uCtrl_User, taskObj);
	});
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
							if (deviceObj.has_subdevice_count >= 1) {
								
								// if it contains subdevices
								_(deviceObj.subDevices).forEach(function (subdeviceObj, subdeviceId) {
									UDevice.fromNinjaBlocks(deviceObj, deviceId, subdeviceObj, subdeviceObj.data, function(device){
										device['parentId'] = platform.id;
										arrObjectsToSave.push(device);
										// create a default scenario under this subdevice
										UScenario.createDefault(function(scenario) {
											scenario['parentId'] = device.id;
											arrObjectsToSave.push(scenario);
											// create tasks under this scenario
											_(self._fromNinjaBlocks.rules).forEach(function(ruleObj, ruleId) {
												if (ruleObj.actions[0].params.guid == deviceId && ruleObj.actions[0].params.da == subdeviceObj.data) {
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
									});
								});
							}
							else {
							
								// if no subdevice
								UDevice.fromNinjaBlocks(deviceObj, deviceId, null, null, function(device) {
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
					});
				},
				function(callback){
					UDevice.find({}, function(err, devices) {
						var count = _(devices).size();
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
					});
				},
				function(callback){
					UScenario.find({}, function(err, scenarios) {
						var count = _(scenarios).size();
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
					});
				},
				function(callback){
					UTask.find({}, function(err, tasks) {
						var count = _(tasks).size();
						_(tasks).forEach(function(taskObj) {
							UScenario.findOne({ id : taskObj.parentId }, function(err, scenarioObj) {
								if (scenarioObj) {
									taskObj['_scenario'] = scenarioObj._id;
									taskObj.save(function(err){
										count--;
										if (count==0) callback(null, 'bind tasks done');
									});
								}
							});
						});
					});
				},
				function(callback){
					UCondition.find({}, function(err, conditions) {
						var count = _(conditions).size();
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
					});
				},
				function(callback){
					UCondition.find({}, function(err, conditions) {
						var countConditions = _(conditions).size();
						_(conditions).forEach(function(conditionObj) {
							if (conditionObj.deviceTpId != null) {
								UDevice.findOne({ tpId : conditionObj.deviceTpId }, function(err, deviceObj) {
									if (deviceObj) {
										conditionObj.deviceId = deviceObj.id;
										conditionObj.save(function(err){
											countConditions--;
											if (countConditions==0) callback(null, 'bind condition step 2 done');
										});
									}
								});
							}
						});
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
	
	/** TODO : need to review this code.
	 * Push all data to NinjaBlocks (asynchronous calls)
	 * Can't do a callback
	 * 
	 */
	 /*
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
					console.log(ninjaDevice);
					console.log(ninjaSubdevice);
					nb.device(ninjaDevice.guid).update(ninjaDevice, function(err, result){
						if (ninjaSubdevice != null) {
							// create subdevices if any
							nb.device(ninjaDevice.guid).subdevice().create(ninjaSubdevice, function(err, result){
								// TODO :  callback
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
										ninjaRule.preconditions.push(ninjaPrecondition);
									});
								});
								
								// rule fully mapped synchronously
								// nb rules can be created before the nb devices (asynchronous).
								console.log(ninjaRule);
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
	*/
};


/**
 * Exports ninjaCrawler object
 * @type ninjaCrawler
 */
module.exports = ninjaCrawler;