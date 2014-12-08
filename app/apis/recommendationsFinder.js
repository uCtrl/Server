'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
	Recommendations = mongoose.model('Recommendations'),
	helper = require('../controllers/helper.js'),
	uuid = require('node-uuid');

module.exports.start = function (user) {

	var analyzePlatforms = function (platforms) {
		var groupedPlatforms = _.groupBy(platforms, function (platform) {
			return platform.room;
		});

		_.forEach(groupedPlatforms, function (platforms) {
			var devices = [];
			_.forEach(platforms, function (platform) {

				// For now, find only the switches
				var filteredDevices = _.filter(platform._devices, function (device) {
					return _.contains([1], device.type);
				});

				devices.push.apply(devices, filteredDevices);
			});
			analyzeDevices(devices);
		});
	};

	var analyzeDevices = function (devices) {
		_.forEach(devices, function (device) {
			var conditions = _.chain(device._scenarios).pluck('_tasks').pluck('_conditions');

			_.forEach(devices, function (otherDevice) {
				if (device._id === otherDevice._id) {
					return;
				}

				var offCondition = _.some(conditions, { 'type': 4, 'deviceId': otherDevice.id, 'beginValue': 0 });

				if (!offCondition) {
					createRecommendation(device, otherDevice, 0);
				}

				var onCondition = _.some(conditions, { 'type': 4, 'deviceId': otherDevice.id, 'beginValue': 1 });

				if (!onCondition) {
					createRecommendation(device, otherDevice, 1);
				}
			});
		});
	};

	var createRecommendation = function (device, otherDevice, value) {
		var recObj = {
			deviceId: device._id,
			taskValue: value,
			conditionType: 4,
			conditionComparisonType: 0,
			conditionBeginValue: value,
			conditionDeviceId: otherDevice.id,
			_user: user._id
		};

		Recommendations.findOne(recObj, function (err, recommendation) {
			if (err || recommendation)
				return;

			recObj.id = uuid.v1();
			recObj.description = ('Turn ' + (value ? 'on \'' : 'off \'' ) + device.name + '\' when device with name \'' + otherDevice.name + '\' is ' + (value ? 'on' : 'off') + '.');

			var rec = new Recommendations(recObj);
			rec.save(function (err) {
				if (err)
					console.log(err);
			});
		});
	};

	helper.getPlatforms(analyzePlatforms, function () {
		console.log('Something went wrong when getting platforms...');
	});
};