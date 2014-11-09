'use strict';

var mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
	cleanJson = require('./cleanJson.js'),
	_ = require('lodash'),
	uuid = require('node-uuid');
	
/**
 * Constants
 * use http://shop.ninjablocks.com/pages/device-ids
 */
var UEType = {
	5 : {
		typeName : 'PushButton',
		maxValue : null,
		minValue : null,
		precision: null,
		unitLabel: null
	},
	6 : {
		typeName : 'LightSensor',
		maxValue : null,
		minValue : null,
		precision: null,
		unitLabel: null
	},
	7 : {
		typeName : 'PIRMotionSensor',
		maxValue : null,
		minValue : null,
		precision: null,
		unitLabel: null
	},
	11 : {
		typeName : 'RF433',
		maxValue : null,
		minValue : null,
		precision: null,
		unitLabel: null
	},
	30 : {
		typeName : 'Humidity',
		maxValue : '100',
		minValue : '0',
		precision: '1',
		unitLabel: '%'
	},
	31 : {
		typeName : 'Temperature',
		maxValue : '35.0',
		minValue : '-25.0',
		precision: '0.1',
		unitLabel: '°C'
	},
	206 : {
		typeName : 'Switch',
		maxValue : null,
		minValue : null,
		precision: null,
		unitLabel: null
	},
	219 : {
		typeName : 'ProximitySensor',
		maxValue : null,
		minValue : null,
		precision: null,
		unitLabel: null
	},
	233 : {
		typeName : 'Light',
		maxValue : null,
		minValue : null,
		precision: null,
		unitLabel: null
	},
	999 : {
		typeName : 'StatusLight',
		maxValue : 'FFFFFF',
		minValue : '000000',
		precision: '1',
		unitLabel: null,
	},
	1000 : {
		typeName : 'OnBoardRGBLed',
		maxValue : 'FFFFFF',
		minValue : '000000',
		precision: '1',
		unitLabel: null
	},
	1007 : {
		typeName : 'NinjasEyes',
		maxValue : 'FFFFFF',
		minValue : '000000',
		precision: '1',
		unitLabel: null
	},
	1009 : {
		typeName : 'BelkinWeMoSocket',
		maxValue : null,
		minValue : null,
		precision: null,
		unitLabel: null
	},
	1012 : {//TODO : Special case of multiple variables (on, hue, bri, sat)
		typeName : 'Limitless LED White',
		maxValue : '254',
		minValue : '0',
		precision: '1',
		unitLabel: 'brightness'
	}
	//...
};

var UESubdeviceType = {//We don't have this info from NinjaBlocks.
	'010111010100011100110000' : 5,
	'110100110101010100110000' : 5,
	'110110101101101011011010' : 1009,
	'110110101101101011010010' : 1009,
	'110110101101101011011110' : 1009,
	'110110101101101011010110' : 1009,
	'110110101101101011011100' : 1009,
	'110110101101101011010100' : 1009,
	'010101010101010101010101' : 7,
	'010101011111000101010000' : 206,//TODO : Door sensor type?
	'010000010101110101010000' : 206,
	'111101010101011101010000' : 206,
	'110111011101010101010000' : 206
	//...
};

var UEStatus = {//TODO : review status code.
	OK : 1,
	Error : 2,
	Disconnected : 3
	//...
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
	parentId: {
		type: String,
		required: true
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
	subdeviceType : String,
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
		ref: 'UPlatform'
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

// Can't use middleware on findAndUpdate functions

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
 * Note that Ninja's subdevices will be mapped to an µCtrl's device
 */
UDeviceSchema.statics.fromNinjaBlocks = function (ninjaDevice, ninjaDeviceId, ninjaSubdevice, ninjaSubdeviceId, cb) {
	var UDevice = mongoose.model('UDevice');
	// Mapping NinjaBlocks to uCtrl  
	var device = new UDevice({
		id : uuid.v1(),
		tpId : ninjaDeviceId,
		name : ninjaDevice.shortName,		
		type : ninjaDevice.did,//check UEType
		description : null,
		maxValue : UEType[ninjaDevice.did].maxValue || null,
		minValue : UEType[ninjaDevice.did].minValue || null,
		value : ninjaDevice.last_data.DA || null,
		precision : UEType[ninjaDevice.did].precision || null,
		status : UEStatus.OK,
		unitLabel : UEType[ninjaDevice.did].unitLabel || null,
		enabled : true,
		lastUpdated : ninjaDevice.last_data.timestamp,
	});
	// If it's a subdevice mapping
	if (ninjaSubdevice != null) {
		device.tpId = device.tpId + ':' + ninjaSubdeviceId;	//id = deviceGUID:subdeviceID
		device.name = ninjaSubdevice.shortName;
		device.subdeviceType = ninjaSubdevice.type; //Allowed: "actuator" or "sensor" 
		device.type = UESubdeviceType[ninjaSubdevice.data];
		device.maxValue = ninjaSubdevice.data;
		device.minValue = ninjaSubdevice.data;
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
	// Post : Can post a subdevice ONLY.
	// Put : shortName and DA can be send.
	// Delete : Delete all informations about the specified device.
	var ninjaDevice = {
		guid : device.tpId,
		default_name : device.name,
		shortName : device.name,//Can be updated
		DA : device.value,//When sending command
		unit : device.unitLabel,
	}
	var ninjaSubdevice = null;
	
	// If it's a subdevice mapping (RF433)
	if (device.type == 11) {
		var deviceTpIdSplit = device.tpId.split(":");//Subdevice data stored into tpId.
		ninjaDevice.guid = deviceTpIdSplit[0];
		ninjaSubdevice = {
			guid : deviceTpIdSplit[0],
			category : "rf",//Allowed: "rf", "webhook", "sms"
			type : device.subdeviceType,//Allowed: "actuator" or "sensor" 
			shortName : device.name,
			data : deviceTpIdSplit[1],									
		}
	}
	cb(ninjaDevice, ninjaSubdevice);
};

UDeviceSchema.plugin(cleanJson);
mongoose.model('UDevice', UDeviceSchema);
