'use strict';

var mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
	cleanJson = require('./cleanJson.js'),
	_ 		 = require('lodash');

/**
 * UDevice Schema
 */
var UDeviceSchema = new Schema({
	id: {
		type: String,
		required: true,
		unique: true
	},
	type: { 
		type: Number,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	description: String,
	enabled: Boolean,
	isTriggerValue: Boolean,
	maxValue: Number,
	minValue: Number,
	precision: Number,
	status: Number,
	unitLabel: String,
	_platform: {
		type: Schema.Types.ObjectId, 
		ref: 'UPlatform',
		required: true
	},
	_scenarios: [{
		type: Schema.Types.ObjectId, 
		ref: 'UScenario'
	}] 
});

UDeviceSchema.post('save', function (device) {
	var UPlatform = mongoose.model('UPlatform');
	UPlatform.update(
		{ _id: device._platform }, 
		{ $addToSet: { _devices: device._id } }, 
		{ safe: true },
		function (err, num) { if (err) console.log("Error: ", err) });
})

UDeviceSchema.post('remove', function (device) {
	var UPlatform = mongoose.model('UPlatform');
	var UScenario = mongoose.model('UScenario');

	UPlatform.update(
		{ _id: device._platform }, 
		{ $pull: { _devices: device._id } }, 
		{ safe: true },
		function (err, num) { if (err) console.log("Error: ", err) });

	UScenario.find({ _id: { $in: device._scenarios } }, function(err, scenarios) {
		if (err) {
			console.log("Error: ", err);
			return;
		}
		_(scenarios).forEach(function(scenario) { scenario.remove() } );
	});
})

/*
 * Receives the device (from NB) and will call the cb when mapped.
 * To logic here is only to do the mapping
 */
UDeviceSchema.statics.fromNinjaBlocks = function (ninjaDevice, cb) {
	var UDevice = mongoose.model('UDevice');

	var device = new UDevice({});
	// Mapping Ninja to uCtrl
	// device.id = ninjaDevice.id
	// ... 
	cb(device);
};

/*
 * Receives the device (from MongoDB) and will call the cb when mapped
 * To logic here is only to do the mapping
 */
UDeviceSchema.statics.toNinjaBlocks = function (device, cb) {
	var ninjaDevice = {
		// NinjaBlocks' device json
		//...
	}
	// Mapping uCtrl to NinjaBlocks
	// ninjaDevice.id = device.guid
	// ... 
	cb(ninjaDevice);
};

/* fromNinjaBlocks: {
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
						deviceType		: deviceObj.device_type,
					});
					out.push(obj);
				});
				return cb(out);
			});
		},
		
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
					deviceType		: deviceObj.device_type,
				});
				return cb(obj);
			});
		},
    }*/

UDeviceSchema.plugin(cleanJson);
mongoose.model('UDevice', UDeviceSchema);