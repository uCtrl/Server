'use strict';

var mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
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
UPlatformSchema.methods.fromNinjaBlocks = function (ninjaBlock, cb) {
	var UPlatform = mongoose.model('UPlatform');

	var platform = new UPlatform({});
	// Mapping Ninja to uCtrl
	// platform.id = block.guid
	// ... 
	cb(platform);
}

/*
 * Receives the platform (from MongoDB) and will call the cb when mapped
 * To logic here is only to do the mapping
 */
UPlatformSchema.methods.toNinjaBlocks = function (platform, cb) {
	var block = {
		// NinjaBlocks' block json
		//...
	}
	// Mapping uCtrl to NinjaBlocks
	// block.id = platform.guid
	// ... 
	cb(block);
}

/*
fromNinjaBlocks: {
		all: function(req, cb) {
			var uplatform = mongoose.model('UPlatform');
			ninja.blocks(function(err, arrBlocks){
				var out = [];
				_.each(arrBlocks, function(blockObj, blockIndex){
					var obj = new uplatform({
						firmwareVersion	: null,
						id				: blockIndex,
						name			: blockObj.short_name,
						port			: null,
						room			: null,
						enabled			: null,
						ip				: null,
					});
					out.push(obj);
				});
				return cb(out);
			});
		},
		
		show: function(req, cb) {
			var uplatform = mongoose.model('UPlatform');
			ninja.block(req.params.platformId, function(err, blockObj){
				var obj = new uplatform({
					firmwareVersion	: null,
					id				: req.params.platformId,
					name			: blockObj.short_name,
					port			: null,
					room			: null,
					enabled			: null,
					ip				: null,
				});
				return cb(obj);
			});
		},
    }
    */

mongoose.model('UPlatform', UPlatformSchema);