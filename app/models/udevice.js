'use strict';

var mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
	cleanJson = require('./cleanJson.js'),
	_ = require('lodash'),
	uuid = require('node-uuid');
	
/**
 * Constants
 * Use http://shop.ninjablocks.com/pages/device-ids
 * TODO : Déterminer les constantes ici.
 */
var ENUMTYPE = {
	"temperature" : 1,
	"humidity" : 2,
	"rgbled8" : 3,
	"rgbled" : 4,
	"rf433" : 5,
	"rf433Sensor" : 6,
	"rf433Actuator" : 7,
};

/**
 * UDevice Schema
 */
var UDeviceSchema = new Schema({
	id: {
		type: String,
		required: true,
		unique: true
	},
	tpId: {
		type: String,
		required: true,
		unique: true
	},
	name: String,
	type: { 
		type: Number,
		required: true
	},
	description: String,
	maxValue: String,
	minValue: String,
	value: String,
	precision: Number,
	status: Number,
	unitLabel: String,
	enabled: Boolean,
	lastUpdated: Number, 
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
		
	this.db.model('UDevice').emit('new', this);
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
	
	this.db.model('UDevice').emit('remove', this);
})

/*
 * Receives the device (from NB) and will call the cb when mapped.
 * To logic here is only to do the mapping
 * Note that Ninja's subdevices will be mapped to an µCtrl's device
 */
UDeviceSchema.statics.fromNinjaBlocks = function (ninjaDevice, ninjaDeviceId, ninjaSubdevice, ninjaSubdeviceId, cb) {
	var UDevice = mongoose.model('UDevice');
	// Mapping NinjaBlocks to uCtrl  
	var device = new UDevice({
		id : uuid.v1(),
		tpId : ninjaDeviceId,
		name : ninjaDevice.default_name,		
		type : ENUMTYPE[ninjaDevice.device_type],
		description : null,
		maxValue : null,
		minValue : null,
		value : (ninjaDevice.last_data != undefined, ninjaDevice.last_data.DA, null),
		precision : null,
		status : null,
		unitLabel : ninjaDevice.unit,
		enabled : true,
		lastUpdated : ninjaDevice.last_data.timestamp,
	});
	// If it's a subdevice mapping
	if (ninjaSubdevice != null) {
		device.tpId = device.tpId + ':' + ninjaSubdeviceId;	//id = deviceGUID:subdeviceID
		device.name = ninjaSubdevice.shortName;
		device.type = (ninjaSubdevice.type == 'sensor' ? ENUMTYPE["rf433Sensor"] : ENUMTYPE["rf433Actuator"]);
		device.value = ninjaSubdevice.data;
	}
	cb(device);
};

/*
 * Receives the device (from MongoDB) and will call the cb when mapped
 * To logic here is only to do the mapping
 * Note that µCtrl's device can be a Ninja's subdevices
 */
UDeviceSchema.statics.toNinjaBlocks = function (device, cb) {
	// Mapping uCtrl to NinjaBlocks
	// Post : Can't post a device to NinjaBlocks. Can post a subdevice only.
	// Put : shortName and DA can be send.
	// Delete : Delete all informations about the specified device.
	var ninjaDevice = {
		guid : device.tpId,
		default_name : device.name,
		shortName : device.name, //Can be updated
		DA : device.value, //When sending command
		unit : device.unitLabel,
	}
	var ninjaSubdevice = null;
	
	// If it's a subdevice mapping
	if (device.type == ENUMTYPE.rf433Sensor || device.type == ENUMTYPE.rf433Actuator) {
		var deviceTpIdSplit = device.tpId.split(":");	//Subdevice data stored into tpId.
		ninjaDevice.guid = deviceTpIdSplit[0];
		ninjaSubdevice = {
			guid : deviceTpIdSplit[0], //*
			category : "rf", //Allowed: "rf", "webhook", "sms"
			type : (device.type == ENUMTYPE.rf433Sensor ? "sensor" : "actuator"), //Allowed: "actuator" or "sensor" 
			shortName : device.name,
			data : deviceTpIdSplit[1],									
		}
	}
	cb(ninjaDevice, ninjaSubdevice);
};

UDeviceSchema.plugin(cleanJson);
mongoose.model('UDevice', UDeviceSchema);