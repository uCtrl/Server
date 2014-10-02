'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
	UDevice = mongoose.model('UDevice'),
	UScenario = mongoose.model('UScenario');

exports.all = function(req, res) {
	var deviceId = req.params.deviceId;

	UScenario.find({ _device: deviceId }).sort('id').exec(function(err, scenarios) {
		if (err) {
			return res.json(500, {
				error: err//"Can't list the scenarios for device " + deviceId
			});
	    }
		res.json(scenarios);
	});
};

exports.create = function(req, res) {
	var deviceId = req.params.deviceId;
	var scenario = new UScenario(req.body);

	UDevice.findOne({ id: deviceId }).exec(function(err, device) {
		if (err) {
			return res.json(500, {
				error: err//"Can't find the associated device " + deviceId
			});
	    }		
		scenario["_device"] = device._id;
		scenario.save(function(err) {
			if (err) {
				return res.json(500, {
					error: err//"Can't create the scenario"
				});
			}
			res.json(scenario);
		});

	});
};

exports.update = function(req, res) {
	var scenarioId = req.params.scenarioId;

	UScenario.findOne({ id: scenarioId }, function(err, scenario) { 
		if (err) {
			return res.json(500, {
				error: err//"Can't find scenario " + scenarioId + " to update"
			});
		}
		scenario = _.extend(scenario, req.body);
		scenario.save(function(err) {
			if (err) {
				return res.json(500, {
					error: err//"Can't update scenario " + scenarioId
				});
			}
			res.json(scenario);
		});
	});
};

exports.destroy = function(req, res) {
	var scenarioId = req.params.scenarioId;

	UScenario.findOne({ id: scenarioId }, function(err, scenario) {
		if (err) {
			return res.json(500, {
				error: err//"Can't delete scenario " + scenarioId
			});
		}
		res.json(scenario.remove());
	});
};

exports.show = function(req, res) {
	var scenarioId = req.params.scenarioId;

	UScenario.findOne({ id: scenarioId }, function(err, scenario) {
	    if (err) {
			return res.json(500, {
				error: err//"Can't retrieve scenario " + scenarioId
			});
		}
	    res.json(scenario);
	});
};