'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
	UPlatform = mongoose.model('UPlatform'),
	UDevice = mongoose.model('UDevice'),
	UScenario = mongoose.model('UScenario'),
	UTask = mongoose.model('UTask'),
	UCondition = mongoose.model('UCondition'),
	Recommendations = mongoose.model('Recommendations'),
	helper = require('../controllers/helper.js');
	uuid = require('node-uuid');

var analyzePlatforms = function(platforms) {

	var groupedPlatforms = _.groupBy(platforms, function(platform) { return platform.room; });

	_.forEach(groupedPlatforms, function(platforms, i) {
		var devices = [];
		_.forEach(platforms, function(platform) {		
			// For now, find only the switches
			var filteredDevices = _.filter(platform._devices, function(device) {			
				return _.contains([1009], device.type);
			});

			devices.push.apply(devices, filteredDevices);
		});
		console.log("DEVICES");
		console.log(devices);
		analyzeDevices(devices);
	});
};

var analyzeDevices = function(devices) {
	_.forEach(devices, function(device) {
		var deviceIds = _.chain(devices).filter(function(d) { return d.id != device.id; }).pluck('id');
		var conditions = _.chain(device._scenarios).pluck('_tasks').pluck('_conditions');

		_.forEach(deviceIds, function(deviceId) {
			var offCondition = _.some(conditions, { 'type': 4, 'deviceId': deviceId, 'beginValue': 0 });

			if (!offCondition) {
				createRecommendation(device, deviceId, 0);
			}

			var onCondition = _.some(conditions, { 'type': 4, 'deviceId': deviceId, 'beginValue': 1 });

			if (!onCondition) {
				createRecommendation(device, deviceId, 1);
			}
		});
	});
};

var createRecommendation = function(device, deviceId, value) {
	var rec = new Recommendations({
		id: uuid.v1(),
		description: "Turn " + value ? "on " : "off " + "when device with name '" + device.name + "' is " + value ? "on" : "off" + ".",
		deviceId: device._id,
		taskValue: value,
		conditionType: 4,
		conditionComparisonType: 4,
		conditionBeginValue: value,
		conditionDeviceId: deviceId
	});

	rec.save(function(err) {
	    if (err) console.log(err);
	});
};

module.exports.start = function() {
	// For now, only one user is supported, so dig in all the DB
	helper.getPlatforms(analyzePlatforms, function (err) { 
		console.log("Something went wrong when getting platforms...");
	});
};