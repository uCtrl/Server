'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
	uuid = require('node-uuid'),
	User = mongoose.model('User'),
	UPlatform = mongoose.model('UPlatform');

exports.all = function(req, res) {
	User.findOne({ _id: req.uCtrl_User._id }).populate('_platforms').exec(function(err, platforms) {
		if (err) {
			return res.json(500, {
				status: false,
				error: err//"Can't list the platforms"
			});
	    }
		
		UPlatform.emit('all', req.uCtrl_User, platforms);
		res.json({
			status: true,
			error: null,
			platforms: platforms
		});
	});
};

exports.create = function(req, res) {
	var platform = new UPlatform(req.body);
	
	platform["id"] = uuid.v1();
	platform["_user"] = req.uCtrl_User._id;
	platform.save(function(err) {
		if (err) {
			return res.json(500, {
				status: false,
				error: err//"Can't create the platform"
			});
		}
		
		UPlatform.emit('create', req.uCtrl_User, platform);
		res.json({
			status: true,
			error: null,
			platform: platform 
		});
	});
};

exports.update = function(req, res) {
	var platformId = req.params.platformId;

	UPlatform.findOneAndUpdate(
		{ id: platformId }, 
		req.body,
		function (err, platform) {
			if (err) {
				return res.json(500, {
					status: false,
					error: err//"Can't update platform " + platformId
				});
			}
			
			UPlatform.emit('update', req.uCtrl_User, platform);
			res.json({
				status: true,
				error: null,
				platform: platform 
			});
		}
	);
};

exports.destroy = function(req, res) {
	var platformId = req.params.platformId;

	UPlatform.findOne({ id: platformId }, function(err, platform) {
		if (err) {
			return res.json(500, {
				status: false,
				error: err//"Can't delete platform " + platformId
			});
		}
		
		UPlatform.emit('destroy', req.uCtrl_User, platform);
		res.json({
			status: true,
			error: null,
			platform: platform.remove()
		});
	});
};

exports.show = function(req, res) {
	var platformId = req.params.platformId;

	UPlatform.findOne({ id: platformId }, function(err, platform) {
	    if (err) {
			return res.json(500, {
				status: false,
				error: err//"Can't retrieve platform " + platformId
			});
		}
		
		UPlatform.emit('show', req.uCtrl_User, platform);
		res.json({
			status: true,
			error: null,
			platform: platform
		});
	});
};