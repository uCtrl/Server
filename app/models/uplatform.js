'use strict';

var mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
	cleanJson = require('./cleanJson.js'),
	_ = require('lodash'),
	uuid = require('node-uuid');

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
		required: true,
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
	/*
	 * ref : http://grokbase.com/t/gg/mongoose-orm/1235c1mjsq/mongoose-emitting-an-event-in-a-middleware-function
	 * use:
			MyModel.on('new', function(mymodel) {
				io.sockets.emit('new_my_model', mymodel.toJSON());
			});
	*/
	this.db.model('UPlatform').emit('new', this);
});

UPlatformSchema.post('remove', function (platform) {
	var UDevice = mongoose.model('UDevice');
	UDevice.find({ _id: { $in: platform._devices } }, function(err, devices) {
		if (err) {
			console.log("Error: ", err);
			return;
		}
		_(devices).forEach(function(device) { device.remove() } );
		
		this.db.model('UPlatform').emit('remove', this);
	});
})

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
		firmwareVersion : null,
		name : ninjaBlock.short_name,
		ip : null,
		port : null,
		room : null,
		status : null,
		enabled : true,
		lastUpdated : null,
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