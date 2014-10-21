'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
	UPlatform = mongoose.model('UPlatform'),
	UDevice = mongoose.model('UDevice'),
	Stats = mongoose.model('Stats');

exports.all = function(req, res) {
	var platformId = req.params.platformId;

	UPlatform.findOne({ id: platformId }).populate('_devices').exec(function(err, platform) {
		if (err) {
			return res.json(500, {
				status: false,
				error: err//"Can't find the associated platform " + platformId
			});
	    }
	    res.json({
			status: true,
			error: null,
			devices: platform._devices
		});
	});
};

exports.create = function(req, res) {
	// (FRY) Not sure if it's possible, may be for subdevices
	var platformId = req.params.platformId;
	var device = new UDevice(req.body);

	UPlatform.findOne({ id: platformId }).exec(function(err, platform) {
		if (err) {
			return res.json(500, {
				status: false,
				error: err//"Can't find the associated platform " + platformId
			});
	    }		
		device["_platform"] = platform._id;
		device.save(function(err) {
			if (err) {
				return res.json(500, {
					status: false,
					error: err//"Can't create the device"
				});
			}
			res.json({
				status: true,
				error: null,
				device: device
			});
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
					status: false,
					error: err//"Can't update device " + deviceId
				});
			}
			res.json({
				status: true,
				error: null,
				device: device
			});
		}
	);
};

exports.destroy = function(req, res) {
	var deviceId = req.params.deviceId;

	UDevice.findOne({ id: deviceId }, function(err, device) {
		if (err) {
			return res.json(500, {
				status: false,
				error: err//"Can't delete device " + deviceId
			});
		}
		res.json({
			status: true,
			error: null,
			device: device.remove()
		});
	});
};

exports.show = function(req, res) {
	var deviceId = req.params.deviceId;

	UDevice.findOne({ id: deviceId }, function(err, device) {
	    if (err) {
			return res.json(500, {
				status: false,
				error: err//"Can't retrieve device " + deviceId
			});
		}
	    res.json({
			status: true,
			error: null,
			device: device
		});
	});
};

exports.stats = function(req, res) {
	var columns = 'data';
	Stats.find({ 
		id: req.params.deviceId,
		timestamp: {"$gte": req.query.from || 0, "$lt": req.query.to || Date.now()} 
	})
	.select(columns)
	.exec(function (err, stats) {
		if (req.query.fn == "mean") {
			var datas = _.pluck(stats, 'data');
			var mean = _.reduce(datas, function(sum, num) {
				return sum + num;
			});
			mean /= stats.length;
			res.json(mean);
		}
	});
};


/* We'll need to think about the subdevices and what to do exactly with them */