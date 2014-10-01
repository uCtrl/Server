'use strict';

require(__dirname + '/uscenario.js');
var mongoose = require('mongoose');

/**
 * UDevice Schema
 */
var UDeviceSchema 	= new mongoose.Schema({
	description		: String,
	enabled			: String,
	id				: Number,
	isTriggerValue	: Boolean,
	maxValue		: Number,
	minValue		: Number,
	name			: String,
	precision		: Number,
	status			: Number,
	type			: Number,
	unitLabel		: String,
	scenarios		: [mongoose.model('UScenario').schema],
});

/**
 * Statics
 */
UDeviceSchema.statics = {

	/**
	* All
	*
	* @param {Object} req
	* @param {Function} cb callback
	*/
	all: function (req, cb) {
		var uplatform = mongoose.model('UPlatform');
		uplatform.findOne({id : req.params.platformId}, function(err, platformObj){
			return cb(platformObj.devices);
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
					return cb(deviceObj);
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
		var udevice = this;
		var uplatform = mongoose.model('UPlatform');
		uplatform.findOne({id : req.params.platformId}, function(err, platformObj){
			var obj = new udevice(req.body);
			platformObj.devices.push(obj);
			platformObj.save();
			return cb("created");
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
		/*
		uplatform.findOne({id : req.params.platformId}, function(err, platformObj){
			_.each(platformObj.devices, function(obj, index){
				if(obj.id == req.params.deviceId){
					platformObj.devices[index] = req.body;
					platformObj.save();
					return cb("updated");
				}
			});
		});	
		*/
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
					platformObj.devices.remove(deviceObj._id.toString());
					platformObj.save();
					return cb("destroyed");
				}
			});
		});
	},
}

mongoose.model('UDevice', UDeviceSchema);