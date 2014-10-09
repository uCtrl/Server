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
		
		// get user and his ninjablocks userAccessToken
		User.findOne({"id": self._options.userId}, function(err, user) {
			var nb = new ninjablocks({userAccessToken : user.ninjablocks.userAccessToken});
			
			// fetch NinjaBlocks blocks
			nb.blocks( function(err, blocks) {
				self._fromNinjaBlocks.blocks = blocks;
				
				// fetch NinjaBlocks devices
				nb.devices(function(err, devices) {
					self._fromNinjaBlocks.devices = devices;
					
					// fetch NinjaBlocks rules
					nb.rules(function(err, rules) {
						self._fromNinjaBlocks.rules = rules;
						
						// callback after asynchronous calls
						callback(err, true);
					});
				});
			});
		});
	};
	
	/**
	 * Mapping of data after the fetch
	 * @param  {Function} callback   Callback when request finished or error found
	 */
	this.mapData = function(callback){
		// create platforms entries
		_(self._fromNinjaBlocks.blocks).forEach(function (blockObj, blockId)  {
			UPlatform.fromNinjaBlocks(blockObj, blockId, function(platform){
				platform.save();

				// create devices under this platform
				_(self._fromNinjaBlocks.devices).forEach(function (deviceObj, deviceId)  { 
					if (deviceId.split("_")[0] == platform.id) {
						if (deviceObj.has_subdevice_count >= 1) {
							
							// if it contains subdevices
							_(deviceObj.subDevices).forEach(function (subdeviceObj, subdeviceId)  { 			
								UDevice.fromNinjaBlocks(deviceObj, deviceId, subdeviceObj, subdeviceObj.data, function(device){
									device['_platform'] = platform._id;
									device.save();
									
									// create a default scenario under this subdevice
									var scenario = new UScenario({ 
										id : Date.now(), 
										name : 'Default Scenario',
									});
									scenario['_device'] = device._id;
									scenario.save();
									
									// create rules under this scenario
									_(self._fromNinjaBlocks.rules).forEach(function(ruleObj, ruleId)  {
										if (ruleObj.actions[0].params.guid == deviceId && ruleObj.actions[0].params.to == subdeviceObj.data) {
											UTask.fromNinjaBlocks(ruleObj, ruleObj.rid, function(task){
												task['_scenario'] = scenario._id;
												task.save();

												// create conditions under this task
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
						
							// if no subdevices
							UDevice.fromNinjaBlocks(deviceObj, deviceId, null, null, function(device){
								device['_platform'] = platform._id;
								device.save();
								
								// create a default scenario under this device
								var scenario = new UScenario({ 
									id : Date.now(), 
									name : 'Default Scenario',
								});
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
 * Exports ninjaCrawler object
 * @type ninjaCrawler
 */
module.exports = ninjaCrawler;