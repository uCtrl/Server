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

mongoose.model('UPlatform', UPlatformSchema);