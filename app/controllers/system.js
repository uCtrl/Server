'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
	ninjacrawler = require('../apis/ninjacrawler.js'),
	ninjablocks = require('../apis/ninjablocks.js'),
	UPlatform = mongoose.model('UPlatform'),
	UDevice = mongoose.model('UDevice'),
	UScenario = mongoose.model('UScenario'),
	UTask = mongoose.model('UTask'),
	UCondition = mongoose.model('UCondition'),
	User = mongoose.model('User');

exports.all = function(req, res) {
	var mapPrivToPub = {
	    "_devices": "devices",
	    "_scenarios": "scenarios",
	    "_tasks": "tasks",
	    "_conditions": "conditions"
	};

	var changePrivToPub = function (obj) {
		if (_.isArray(obj)) {
			for (var i = 0; i < obj.length; i++) {
				changePrivToPub(obj[i]);
			}
		} else if (_.isPlainObject(obj)) {
			for (var key in obj) {
		       	if (obj.hasOwnProperty(key)) {
		       		var pubKey = mapPrivToPub[key], object;
		       		if (pubKey) {
	               		object = obj[pubKey] = obj[key];
	              		delete obj[key];
		       		} else {
		       			object = obj[key];
		       		}

	       			if (_.isObject(object)) {
		   				changePrivToPub(object);
		       		}
		        }
		    }
		}
	}

	var sendError = function (err) {
		res.json(500, {
			status: false,
			error: err
		});
	}

	UPlatform.find().populate('_devices').sort('id').exec()
	.onResolve(function(err, platforms) {
		if (err) sendError(err);

		var devices = _.flatten(_.pluck(platforms, '_devices'));
		UDevice.populate(devices, { path: '_scenarios' })
		.onResolve(function(err, devices) {
			if (err) sendError(err);

			var scenarios = _.flatten(_.pluck(devices, '_scenarios'));
			UScenario.populate(scenarios, { path: '_tasks' })
			.onResolve(function(err, scenarios) {
				if (err) sendError(err);

				var tasks = _.flatten(_.pluck(scenarios, '_tasks'));
				UTask.populate(tasks, { path: '_conditions' })
				.onResolve(function(err, conditions) {
					if (err) sendError(err);

					for (var i = 0; i < platforms.length; i++) {
						platforms[i]._devices = _.sortBy(platforms[i]._devices, 'name');
						platforms[i] = platforms[i].toObject();
					}
					
					changePrivToPub(platforms);
					res.json({
						status: true,
						error: null,
						platforms: platforms
					});
				});
			});
		});
	});
};

exports.fetchAll = function(req, res) {
	if(req.uCtrl_User.ninjablocks.userAccessToken)
	{
		new ninjacrawler({ userAccessToken: req.uCtrl_NB_UserAccessToken }).fetchAll( function(err, result) {
			res.json({
				status: true,
				error: err,
				result: "Completed - " + results
			});
		});
	}
};