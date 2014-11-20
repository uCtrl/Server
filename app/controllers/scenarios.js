'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
	uuid = require('node-uuid'),
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
		
		UScenario.emit('all', req.uCtrl_User, scenarios);
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
		scenario["id"] = uuid.v1();
		scenario["_device"] = device._id;
		scenario.save(function(err) {
			if (err) {
				return res.json(500, {
					status: false,
					error: err//"Can't create the scenario"
				});
			}
			
			UScenario.emit('create', req.uCtrl_User, scenario);
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
				return res.json(500, {
					status: false,
					error: err//"Can't update scenario " + scenarioId
				});
			}
			
			UScenario.emit('update', req.uCtrl_User, scenario);
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
		
		UScenario.emit('destroy', req.uCtrl_User, scenario);
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
		
		UScenario.emit('show', req.uCtrl_User, scenario);
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
				return res.json(500, {
					status: false,
					error: err//"Can't update scenario " + scenarioId
				});
			}
			
			UScenario.emit('enable', req.uCtrl_User, scenario);
//TODO : test this code below
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