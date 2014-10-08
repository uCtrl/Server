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
	UCondition = mongoose.model('UCondition');

function ninjaCrawler(options) {
	var self = this;
	this._options = options || {};
	this._options.userAccessToken = global.uctrl.ninja.userAccessToken; //TODO temp
	this._fromNinjaBlocks = {
		blocks : [],
		devices : [],
		rules : [],
	};
	
	/**
	 * Fetch all data from NinjaBlocks API (asynchronous calls)
	 * @param  {Function} callback   Callback when request finished or error found
	 */
	this.fetchAll = function(callback) {
		var nb = new ninjablocks({userAccessToken : self._options.userAccessToken});
		
		// fetch NinjaBlocks blocks
		nb.blocks( function(err, blocks) {
			self._fromNinjaBlocks.blocks = blocks;
			
			// fetch NinjaBlocks devices
			nb.devices(function(err, devices) {
				self._fromNinjaBlocks.devices = devices;
				
				// fetch NinjaBlocks rules
				nb.rules(function(err, rules) {
					self._fromNinjaBlocks.rules = rules;
					
					callback(err, true);
				});
			});
		});
	};
	
	/**
	 * Mapping of data after the fetch
	 * @param  {Function} callback   Callback when request finished or error found
	 */
	this.mapData = function(callback){
		//Create platforms entries
		_(self._fromNinjaBlocks.blocks).forEach(function (blockObj, blockId)  {
			UPlatform.fromNinjaBlocks(blockObj, blockId, function(platform){
				platform.save();

				//Create devices under this platform
				_(self._fromNinjaBlocks.devices).forEach(function (deviceObj, deviceId)  { 
					if (deviceId.split("_")[0] == platform.id) {
						if (deviceObj.has_subdevice_count >= 1) {
							//If it contains subdevices
							_(deviceObj.subDevices).forEach(function (subdeviceObj, subdeviceId)  { 			
								UDevice.fromNinjaBlocks(deviceObj, deviceId, subdeviceObj, subdeviceObj.data, function(device){
									device['_platform'] = platform._id;
									device.save();
									
									//Create a default scenario under this device
									var scenario = new UScenario({ 
										id : Date.now(), 
										name : 'Default Scenario',
									});
									scenario['_device'] = device._id;
									scenario.save();
									
									//Create rules under the scenario
									_(self._fromNinjaBlocks.rules).forEach(function(ruleObj, ruleId)  {
										if (ruleObj.actions[0].params.guid == deviceId) {
											UTask.fromNinjaBlocks(ruleObj, ruleObj.rid, function(task){
												task['_scenario'] = scenario._id;
												task.save();

												//Create conditions under the task
												_(ruleObj.preconditions).forEach(function(preconditionObj, preconditionId)  {						
													UCondition.fromNinjaBlocks(preconditionObj, null, function(condition){
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
						else {
							UDevice.fromNinjaBlocks(deviceObj, deviceId, null, null, function(device){
								device['_platform'] = platform._id;
								device.save();
								
								//Create a default scenario under the device
								var scenario = new UScenario({ 
									id : Date.now(), 
									name : 'Default Scenario',
								});
								scenario['_device'] = device._id;
								scenario.save();
								
								//Create rules under the scenario
								_(self._fromNinjaBlocks.rules).forEach(function(ruleObj, ruleId)  {
									if (ruleObj.actions[0].params.guid == deviceId) {
											UTask.fromNinjaBlocks(ruleObj, ruleObj.rid, function(task){
												task['_scenario'] = scenario._id;
												task.save();
												
												//Create conditions under the task
												_(ruleObj.preconditions).forEach(function(preconditionObj, preconditionId)  {						
													UCondition.fromNinjaBlocks(preconditionObj, task.id + ':' + preconditionId, function(condition){
														condition['_task'] = task._id;
														condition.save();
													});
												});
											});
									}
								});
							});
						}
					}
				});
			});
		});
		
		callback(null, true);
	};
};


/**
 * Exports ninjaCrawlUser object
 * @type ninjaCrawlUser
 */
module.exports = ninjaCrawler;


/*
Old fashion
//Fetch NinjaBlocks blocks
		nb.blocks( function(err, blocks) {
			console.log("###Fetching blocks");
			_(blocks).forEach(function (blockObj, blockId)  { 
				UPlatform.fromNinjaBlocks(blockObj, blockId, function(platform){
					console.log(platform);
					platform.save();
				});
			});
			
			//Fetch NinjaBlocks devices
			nb.devices(function(err, devices) {
				console.log("###Fetching devices");
				_(devices).forEach(function (deviceObj, deviceId)  { 
					var blockId = deviceId.split("_")[0];
					
					//Fetch NinjaBlocks device's subdevices
					if (deviceObj.has_subdevice_count >= 1) {
						_(deviceObj.subDevices).forEach(function (subdeviceObj, subdeviceId)  { 			
							UPlatform.findOne({ id: blockId }).exec(function(err, platform) {
								if (!err) {
									UDevice.fromNinjaBlocks(deviceObj, deviceId, subdeviceObj, subdeviceObj.data, function(device){
										device['_platform'] = platform._id;
										console.log(device);
										device.save();
										
										//Create default scenario
										var scenario = new UScenario({ 
											id : Date.now(), 
											name : 'Default Scenario',
											_device : device._id,
										});
										scenario.save();
									});
								}	
							});	
						});
					}
					else {
						UPlatform.findOne({ id: blockId }).exec(function(err, platform) {
							if (!err) {
								UDevice.fromNinjaBlocks(deviceObj, deviceId, null, null, function(device){
									device['_platform'] = platform._id;
									console.log(device);
									device.save();
									
									//Create default scenario
										var scenario = new UScenario({ 
											id : Date.now(), 
											name : 'Default Scenario',
											_device : device._id,
										});
										scenario.save();
								});
							}	
						});	
					}
				});
				
				//Fetch NinjaBlocks rules
				nb.rules(function(err, rules) {
					console.log("###Fetching rules");
					_(rules).forEach(function(ruleObj, ruleId)  {
						var deviceId = ruleObj.actions[0].params.guid;
						
						UDevice.findOne({ id : deviceId}).exec(function(err, device) {
							if (!err) {
								UTask.fromNinjaBlocks(ruleObj, ruleObj.rid, function(task){
									task['_scenario'] = device._scenarios[0]._id;
									console.log(task);
									task.save();
									
									//Fetch NinjaBlocks rule's preconditions
									console.log("###Fetching preconditions");
									_(ruleObj.preconditions).forEach(function(preconditionObj, preconditionId)  {						
										UCondition.fromNinjaBlocks(preconditionObj, null, function(condition){
											condition['_task'] = task._id;
											console.log(condition);
											condition.save();
										});
									});
								});
							}	
						});	
					});
				});
			});
		});
*/