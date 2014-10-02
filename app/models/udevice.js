'use strict';

require(__dirname + '/uscenario.js');
var _ = require('lodash');
var mongoose = require('mongoose');
var ninjaBlocks = require(__base + 'app/apis/ninjablocks.js');
var ninja = new ninjaBlocks( {userAccessToken:global.uctrl.ninja.userAccessToken} );

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
	
	/**
	* fromNinjaBlocks
	* 
	*/
	fromNinjaBlocks: {
		/**
		 * all
		 *
		 * @param {Function} cb
		 * @api public
		 */
		all: function(req, cb) {
			var udevice = mongoose.model('UDevice');
			ninja.devices(function(err, arrDevices){
				var out = [];
				_.each(arrDevices, function(deviceObj, deviceIndex){
					var obj = new udevice({
						description		: deviceObj.default_name,
						enabled			: null,
						id				: deviceIndex,
						isTriggerValue	: null,
						maxValue		: null,
						minValue		: null,
						name			: deviceObj.default_name,
						precision		: null,
						status			: null,
						type			: null,
						unitLabel		: deviceObj.unit,
						/*TODO*/
						deviceType		: deviceObj.device_type,
					});
					out.push(obj);
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
			var udevice = mongoose.model('UDevice');
			ninja.device(req.params.deviceId, function(err, deviceObj){
				var obj = new udevice({
					description		: deviceObj.default_name,
					enabled			: null,
					id				: deviceObj.guid,
					isTriggerValue	: null,
					maxValue		: null,
					minValue		: null,
					name			: deviceObj.default_name,
					precision		: null,
					status			: null,
					type			: null,
					unitLabel		: deviceObj.unit,
					/*TODO*/
					deviceType		: deviceObj.device_type,
				});
				return cb(obj);
			});
		},
    },
}

mongoose.model('UDevice', UDeviceSchema);