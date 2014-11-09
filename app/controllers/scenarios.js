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
				status: false,
				error: err//"Can't list the scenarios for device " + deviceId
			});
	    }
		
		UScenario.emit('all', scenarios);
		res.json({
			status: true,
			error: null,
			scenarios: scenarios
		});
	});
};

exports.create = function(req, res) {
	var deviceId = req.params.deviceId;
	var scenario = new UScenario(req.body);

	UDevice.findOne({ id: deviceId }).exec(function(err, device) {
		if (err) {
			return res.json(500, {
				status: false,
				error: err//"Can't find the associated device " + deviceId
			});
	    }		
		scenario["_device"] = device._id;
		scenario.save(function(err) {
			if (err) {
				return res.json(500, {
					status: false,
					error: err//"Can't create the scenario"
				});
			}
			
			UScenario.emit('create', scenario);
			res.json({
				status: true,
				error: null,
				scenario: scenario
			});
		});

	});
};

exports.update = function(req, res) {
	var scenarioId = req.params.scenarioId;

	UScenario.findOne(
		{ id: scenarioId }, 
		req.body,
		function (err, scenario) {
			if (err) {
				return res.json(500, {
					status: false,
					error: err//"Can't update scenario " + scenarioId
				});
			}
			
			UScenario.emit('update', scenario);
			res.json({
				status: true,
				error: null,
				scenario: scenario
			});
		}
	);
};

exports.destroy = function(req, res) {
	var scenarioId = req.params.scenarioId;

	UScenario.findOne({ id: scenarioId }, function(err, scenario) {
		if (err) {
			return res.json(500, {
				status: false,
				error: err//"Can't delete scenario " + scenarioId
			});
		}
		
		UScenario.emit('destroy', scenario);
		res.json({
			status: true,
			error: null,
			scenario: scenario.remove()
		});
	});
};

exports.show = function(req, res) {
	var scenarioId = req.params.scenarioId;

	UScenario.findOne({ id: scenarioId }, function(err, scenario) {
	    if (err) {
			return res.json(500, {
				status: false,
				error: err//"Can't retrieve scenario " + scenarioId
			});
		}
		
		UScenario.emit('show', scenario);
	    res.json({
			status: true,
			error: null,
			scenario: scenario
		});
	});
};