'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
	uuid = require('node-uuid'),
	UDevice = mongoose.model('UDevice'),
	UScenario = mongoose.model('UScenario');

exports.all = function(req, res) {
	var deviceId = req.params.deviceId;

	UDevice.findOne({ id: deviceId}, function(err, device) {
		UScenario.find({ _device: device._id }, function(err, scenarios) {
			if (err) {
				return res.status(500).json({
					status: false,
					error: err
				});
		    }
			
			UScenario.emit('all', req.user, scenarios);
			res.json({
				status: true,
				error: null,
				scenarios: scenarios
			});
		});
	});
};

exports.create = function(req, res) {
	var deviceId = req.params.deviceId;
	var scenario = new UScenario(req.body);

	UDevice.findOne({ id: deviceId }).exec(function(err, device) {
		if (err) {
			return res.status(500).json({
				status: false,
				error: err
			});
	    }		
		scenario["id"] = uuid.v1();
		scenario["_device"] = device._id;
		scenario["_user"] = req.user._id;
		scenario.save(function(err) {
			if (err) {
				return res.status(500).json({
					status: false,
					error: err
				});
			}
			
			UScenario.emit('create', req.user, scenario);
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

	UScenario.findOneAndUpdate(
		{ id: scenarioId }, 
		req.body,
		function (err, scenario) {
			if (err) {
				return res.status(500).json({
					status: false,
					error: err
				});
			}
			
			UScenario.emit('update', req.user, scenario);
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
			return res.status(500).json({
				status: false,
				error: err
			});
		}
		
		UScenario.emit('destroy', req.user, scenario);
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
			return res.status(500).json({
				status: false,
				error: err
			});
		}
		
		UScenario.emit('show', req.user, scenario);
	    res.json({
			status: true,
			error: null,
			scenario: scenario
		});
	});
};

exports.enable = function(req, res) {
	var scenarioId = req.params.scenarioId;

	UScenario.findOneAndUpdate(
		{ id: scenarioId }, 
		{ enabled : true },
		function (err, scenario) {
			if (err) {
				return res.status(500).json(500, {
					status: false,
					error: err
				});
			}
			
			UScenario.emit('enable', req.user, scenario);
			UScenario.update(//set other scenarios to disabled
				{ _device: scenario._device, _id: { $ne: scenario._id} }, 
				{ $set: { enabled : false } }, 
				{ safe: true },
				function (err, num) { 
					if (err) console.log("Error: ", err) });
			
			res.json({
				status: true,
				error: null,
				scenario: scenario
			});
		}
	);
};