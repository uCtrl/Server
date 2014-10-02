'use strict';

require(__dirname + '/utask.js');
var _ = require('lodash');
var mongoose = require('mongoose');
var ninjaBlocks = require(__base + 'app/apis/ninjablocks.js');
var ninja = new ninjaBlocks( {userAccessToken:global.uctrl.ninja.userAccessToken} );

/**
 * UScenario Schema
 */
var UScenarioSchema = new mongoose.Schema({
	id				: Number,
	name			: String,
	tasks			: [mongoose.model('UTask').schema],
});

/**
 * Statics
 */
UScenarioSchema.statics = {

	/**
	* All
	*
	* @param {Object} req
	* @param {Function} cb callback
	*/
	all: function (req, cb) {
		var uplatform = mongoose.model('UPlatform');
		uplatform.findOne({id : req.params.platformId}, function(err, platformObj){
			platformObj.devices.forEach(function(deviceObj){
				if(deviceObj.id == req.params.deviceId){
					return cb(deviceObj.scenarios);
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
							return cb(scenarioObj);
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
		var uscenario = this;
		var uplatform = mongoose.model('UPlatform');
		uplatform.findOne({id : req.params.platformId}, function(err, platformObj){
			platformObj.devices.forEach(function(deviceObj, deviceIndex){
				if(deviceObj.id == req.params.deviceId){
					var obj = new uscenario(req.body);
					platformObj.devices[deviceIndex].scenarios.push(obj);
					platformObj.save();
					return cb("created");
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
							platformObj.devices[deviceIndex].scenarios.remove(scenarioObj._id.toString());
							platformObj.save();
							return cb("destroyed");
						}
					});
				}
			});
		});
	},
}

mongoose.model('UScenario', UScenarioSchema);