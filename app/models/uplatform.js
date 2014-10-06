'use strict';

var mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
	cleanJson = require('./cleanJson.js'),
	_ 		 = require('lodash');

/**
 * UPlatform Schema
 */
var UPlatformSchema	= new Schema({
	name: { 
		type: String,
		required: true
	},
	id: {
		type: String,
		required: true,
		unique: true
	},
	firmwareVersion: String,
	port: Number,
	room: String,
	enabled: Boolean,
	ip: String,
	_devices : [{
		type: Schema.Types.ObjectId, 
		ref: 'UDevice'
	}] 
});

UPlatformSchema.post('remove', function (platform) {
	var UDevice = mongoose.model('UDevice');
	UDevice.find({ _id: { $in: platform._devices } }, function(err, devices) {
		if (err) {
			console.log("Error: ", err);
			return;
		}
		_(devices).forEach(function(device) { device.remove() } );
	});
})

/*
 * Receives the block (from NB) and will call the cb when mapped.
 * To logic here is only to do the mapping
 */
UPlatformSchema.statics.fromNinjaBlocks = function (ninjaBlock, ninjaBlockId, cb) {
	var UPlatform = mongoose.model('UPlatform');
	// Mapping Ninja to uCtrl
	var platform = new UPlatform({
		firmwareVersion	: null,
		id				: ninjaBlockId,		//have this info with all blocks GET request only. See examples of GET. 
		name			: ninjaBlock.short_name,
		port			: null,
		room			: null,
		enabled			: true,
		ip				: null,
	});
	
	cb(platform);
};

/*
 * Receives the platform (from MongoDB) and will call the cb when mapped
 * To logic here is only to do the mapping
 */
UPlatformSchema.statics.toNinjaBlocks = function (platform, cb) {
	//Can't post a block. Can post a nodeid to activate the block only
	var block = {
		nodeid			: platform.id		//when posting a block
		//short_name	: platform.name		//can't post this info.
		//last_active
		//date_created
	}
	cb(block);
};

UPlatformSchema.plugin(cleanJson);
mongoose.model('UPlatform', UPlatformSchema);


/* 
 * Examples of GET
 *
	https://api.ninja.is/rest/v0/block
	{
		"result": 1,
		"error": null,
		"id": 0,
		"data": {
			"1014BBBK6089": {
				"short_name": "Ninja Block",
				"date_created": 1411493487000,
				"last_active": 1412360537074
			}
		}
	}
	https://api.ninja.is/rest/v0/block/1014BBBK6089
	{
		"result": 1,
		"error": null,
		"id": 0,
		"data": {
			"short_name": "Ninja Block",
			"date_created": 1411493487000,
			"last_active": 1412360537074
		}
	}
*/