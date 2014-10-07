'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
	UPlatform = mongoose.model('UPlatform'),
	UDevice = mongoose.model('UDevice'),
	UScenario = mongoose.model('UScenario'),
	UTask = mongoose.model('UTask'),
	UCondition = mongoose.model('UCondition');

exports.all = function(req, res) {
	function sendError (err) {
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