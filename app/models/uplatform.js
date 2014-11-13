'use strict';

var mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
	cleanJson = require('./cleanJson.js'),
	_ = require('lodash'),
	uuid = require('node-uuid');

/**
 * Constants
 */
var UEStatus = {//TODO : review status code.
	OK : 1,
	Error : 2,
	Disconnected : 3
	//...
};

/**
 * UPlatform Schema
 */
var UPlatformSchema = new Schema({
	id: {
		type: String,
		required: true,
		unique: true
	},
	tpId: {
		type: String,
		//required: true,
		unique: true
	},
	firmwareVersion: String,
	name: String,
	ip: String,
	port: Number,
	room: String,
	status: Number,
	enabled: Boolean,
	lastUpdated: Number,
	_devices : [{
		type: Schema.Types.ObjectId, 
		ref: 'UDevice'
	}] 
});

UPlatformSchema.post('save', function (platform) {
});

// Can't use middleware on findAndUpdate functions

UPlatformSchema.post('remove', function (platform) {
	var UDevice = mongoose.model('UDevice');
	UDevice.find({ _id: { $in: platform._devices } }, function(err, devices) {
		if (err) {
			console.log("Error: ", err);
			return;
		}
		_(devices).forEach(function(device) { device.remove() } );
	});
});

/*
 * Receives the block (from NB) and will call the cb when mapped.
 * To logic here is only to do the mapping
 */
UPlatformSchema.statics.fromNinjaBlocks = function (ninjaBlock, ninjaBlockId, cb) {
	var UPlatform = mongoose.model('UPlatform');
	// Mapping Ninja to uCtrl
	// id : Have this info with all blocks GET request only. See examples of GET.
	var platform = new UPlatform({
		id : uuid.v1(),
		tpId : ninjaBlockId,
		firmwareVersion : '3.813',
		name : ninjaBlock.short_name,
		ip : null,
		port : 443,
		room : null,
		status : UEStatus.OK,
		enabled : true,
		lastUpdated : ninjaBlock.date_created,
	});
	
	cb(platform);
};

/*
 * Receives the platform (from MongoDB) and will call the cb when mapped
 * To logic here is only to do the mapping
 */
UPlatformSchema.statics.toNinjaBlocks = function (platform, cb) {
	//Can't post a block. Can post a nodeid to activate the block only
	var ninjaBlock = {
		nodeid : platform.tpId,
		short_name : platform.name
	}
	cb(ninjaBlock);
};

UPlatformSchema.plugin(cleanJson);
mongoose.model('UPlatform', UPlatformSchema);