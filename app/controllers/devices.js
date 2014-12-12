'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
	uuid = require('node-uuid'),
	UPlatform = mongoose.model('UPlatform'),
	UDevice = mongoose.model('UDevice'),
	Stats = mongoose.model('Stats'),
	Logs = mongoose.model('Log'),
	async = require('async');

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

	async.waterfall([
		// Find old device
		function(callback){
			UDevice.findOne({ id: deviceId }, function (err, device) {
				callback(err, device);
			});
		},
		// update new device
		function(device, callback){ 
			UDevice.findOneAndUpdate(
				{ id: deviceId },
				req.body,
				function(err, dev) {
					if (err) callback(err);
					callback(err, device, dev);
				});
		},
		// check differences and log
		function(old, device, callback){ 
			var properties = ['name', 'description'];
			async.each(properties, function(p, cb) {
				if (old[p] != device[p]){

					var l = new Logs({
						type: Logs.LOGTYPE.Update, 
						severity: Logs.LOGSEVERITY.Normal,  
						message: "Updated " + p + " to '"+ device[p]+"'.",
						id: device.id,
						timestamp: Date.now()
					});
					console.log(l);
					l.save(function(err) {
						cb(err);
					});
				} else cb(null);
			}, function (err) {
				if (err) console.log ("error logging device metadata difference");
				callback(null, device)
			});
		}], 
		// results
		function (err, device) {
			if (err) {
				console.log ("waterfall error..");
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