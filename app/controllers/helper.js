'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
	UPlatform = mongoose.model('UPlatform'),
	UDevice = mongoose.model('UDevice'),
	UScenario = mongoose.model('UScenario'),
	UTask = mongoose.model('UTask'),
	UCondition = mongoose.model('UCondition');


exports.getPlatforms = function(cb, errCb) {
	UPlatform.find().populate('_devices').sort('room').exec()
	.onResolve(function(err, platforms) {
		if (err) { 
			errCb(err);
			return;
		}

		var devices = _.flatten(_.pluck(platforms, '_devices'));
		UDevice.populate(devices, { path: '_scenarios' })
		.onResolve(function(err, devices) {
			if (err) {
				errCb(err);	
				return;
			} 

			var scenarios = _.flatten(_.pluck(devices, '_scenarios'));
			UScenario.populate(scenarios, { path: '_tasks' })
			.onResolve(function(err, scenarios) {
				if (err) {
					errCb(err);	
					return;
				} 

				var tasks = _.flatten(_.pluck(scenarios, '_tasks'));
				UTask.populate(tasks, { path: '_conditions' })
				.onResolve(function(err, conditions) {
					if (err) {
						errCb(err);	
						return;
					} 

					for (var i = 0; i < platforms.length; i++) {
						platforms[i] = platforms[i].toObject();
					}
					
					cb(platforms);
				});
			});
		});
	});
};