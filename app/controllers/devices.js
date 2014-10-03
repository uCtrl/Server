'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
	UPlatform = mongoose.model('UPlatform'),
	UDevice = mongoose.model('UDevice');

exports.all = function(req, res) {
	var platformId = req.params.platformId;

	UPlatform.findOne({ id: platformId }).populate('_devices').exec(function(err, platform) {
		if (err) {
			return res.json(500, {
				error: err//"Can't find the associated platform " + platformId
			});
	    }
	    res.json(platform._devices);
	});
};

exports.create = function(req, res) {
	// (FRY) Not sure if it's possible, may be for subdevices
	var platformId = req.params.platformId;
	var device = new UDevice(req.body);

	UPlatform.findOne({ id: platformId }).exec(function(err, platform) {
		if (err) {
			return res.json(500, {
				error: err//"Can't find the associated platform " + platformId
			});
	    }		
		device["_platform"] = platform._id;
		device.save(function(err) {
			if (err) {
				return res.json(500, {
					error: err//"Can't create the device"
				});
			}
			res.json(device);
		});

	});
};

exports.update = function(req, res) {
	var deviceId = req.params.deviceId;

	UDevice.findOneAndUpdate(
		{ id: deviceId }, 
		req.body,
		function (err, platform) {
			if (err) {
				return res.json(500, {
					error: err//"Can't update device " + deviceId
				});
			}
			res.json(device);
		}
	);
};

exports.destroy = function(req, res) {
	var deviceId = req.params.deviceId;

	UDevice.findOne({ id: deviceId }, function(err, device) {
		if (err) {
			return res.json(500, {
				error: err//"Can't delete device " + deviceId
			});
		}
		res.json(device.remove());
	});
};

exports.show = function(req, res) {
	var deviceId = req.params.deviceId;

	UDevice.findOne({ id: deviceId }, function(err, device) {
	    if (err) {
			return res.json(500, {
				error: err//"Can't retrieve device " + deviceId
			});
		}
	    res.json(device);
	});
};

/* We'll need to think about the subdevices and what to do exactly with them */