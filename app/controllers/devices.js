'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
	uuid = require('node-uuid'),
	UPlatform = mongoose.model('UPlatform'),
	UDevice = mongoose.model('UDevice'),
	Stats = mongoose.model('Stats'),
	Logs = mongoose.model('Log');

exports.all = function(req, res) {
	var platformId = req.params.platformId;

	UPlatform.findOne({ id: platformId}, function(err, platform) {
		UDevice.find({ _platform: platform._id }, function(err, devices) {
			if (err) {
				return res.status(500).json({
					status: false,
					error: err
				});
			}
			
			UDevice.emit('all', req.user, devices);
			res.json({
				status: true,
				error: null,
				devices: devices
			});
		});
	});
};

// UNUSED
exports.create = function(req, res) {
	var platformId = req.params.platformId;
	var device = new UDevice(req.body);

	UPlatform.findOne({ id: platformId }).exec(function(err, platform) {
		if (err) {
			return res.status(500).json({
				status: false,
				error: err
			});
		}		
		device["id"] = uuid.v1();
		device["_platform"] = platform._id;
		device["_user"] = req.user._id;
		device.save(function(err) {
			if (err) {
				return res.status(500).json({
					status: false,
					error: err
				});
			}
			
			UDevice.emit('create', req.user, device);
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
		function (err, device) {
			if (err) {
				return res.status(500).json({
					status: false,
					error: err
				});
			}
			
			UDevice.emit('update', req.user, device);
			res.json({
				status: true,
				error: null,
				device: device
			});
		});
};

// UNUSED
exports.destroy = function(req, res) {
	var deviceId = req.params.deviceId;

	UDevice.findOne({ id: deviceId }, function(err, device) {
		if (err) {
			return res.status(500).json({
				status: false,
				error: err
			});
		}
		
		UDevice.emit('destroy', req.user, device);
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
			return res.status(500).json({
				status: false,
				error: err
			});
		}
		
		UDevice.emit('show', req.user, device);
		res.json({
			status: true,
			error: null,
			device: device
		});
	});
};

exports.stats = function(req, res) {
	var columns = 'data timestamp';
	Stats.find({ 
		id: req.params.deviceId,
		timestamp: {"$gte": req.query.from || 0, "$lt": req.query.to || Date.now()} 
	})
	.select(columns)
	.exec(function (err, stats) {
		// MEAN
		if (req.query.fn == "mean") {
			var datas = _.pluck(stats, 'data');
			var mean = _.reduce(datas, function(sum, num) {
				return sum + num;
			});
			mean /= stats.length;
			res.json(mean);
		} 

		// MAXIMUM
		else if (req.query.fn == "max") {
			var max = _.max(stats, 'data');
			res.json(max);
		} 

		// MINIMUM
		else if (req.query.fn == "min") {
			var min = _.min(stats, 'data');
			res.json(min);
		} 

		else {
			res.json(stats);
		}
	});
};

exports.logs = function(req, res) {
	var columns = 'id type severity message timestamp';

	Logs.find({
		id: req.params.deviceId,
		timestamp: {"$gte": req.query.from || 0, "$lt": req.query.to || Date.now()}
	})
	.select(columns)
	.exec(function (err, logs) {
		if (err) {
			res.status(500).json({
				status: !err,
				error: err,
				history: logs
			});
		} else {
			res.json({
				status: !err,
				error: null,
				history: logs
			});
		}
	});
};