'use strict';

var mongoose = require('mongoose'),
	uuid = require('node-uuid'),
	UPlatform = mongoose.model('UPlatform');

exports.all = function (req, res) {
	UPlatform.find({ _user: req.user._id }, function (err, platforms) {
		if (err) {
			return res.status(500).json({
				status: false,
				error: err
			});
		}

		UPlatform.emit('all', req.user, platforms);
		res.json({
			status: true,
			error: null,
			platforms: platforms
		});
	});
};

// UNUSED
exports.create = function (req, res) {
	var platform = new UPlatform(req.body);

	platform.id = uuid.v1();
	platform._user = req.user._id;
	platform.save(function (err) {
		if (err) {
			return res.status(500).json({
				status: false,
				error: err
			});
		}

		UPlatform.emit('create', req.user, platform);
		res.json({
			status: true,
			error: null,
			platform: platform
		});
	});
};

exports.update = function (req, res) {
	var platformId = req.params.platformId;

	UPlatform.findOneAndUpdate(
		{ id: platformId },
		req.body,
		function (err, platform) {
			if (err) {
				return res.status(500).json({
					status: false,
					error: err
				});
			}

			UPlatform.emit('update', req.user, platform);
			res.json({
				status: true,
				error: null,
				platform: platform
			});
		}
	);
};

// UNUSED
exports.destroy = function (req, res) {
	var platformId = req.params.platformId;

	UPlatform.findOne({ id: platformId }, function (err, platform) {
		if (err) {
			return res.status(500).json({
				status: false,
				error: err
			});
		}

		UPlatform.emit('destroy', req.user, platform);
		res.json({
			status: true,
			error: null,
			platform: platform.remove()
		});
	});
};

exports.show = function (req, res) {
	var platformId = req.params.platformId;

	UPlatform.findOne({ id: platformId }, function (err, platform) {
		if (err) {
			return res.status(500).json({
				status: false,
				error: err
			});
		}

		UPlatform.emit('show', req.user, platform);
		res.json({
			status: true,
			error: null,
			platform: platform
		});
	});
};