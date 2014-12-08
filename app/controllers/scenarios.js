'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
	uuid = require('node-uuid'),
	UDevice = mongoose.model('UDevice'),
	Logs = mongoose.model('Log'),
	UScenario = mongoose.model('UScenario'),
	UTask = mongoose.model('UTask'),
	UCondition = mongoose.model('UCondition');

exports.all = function (req, res) {
	var deviceId = req.params.deviceId;

	UDevice.findOne({ id: deviceId}, function (err, device) {
		UScenario.find({ _device: device._id }, function (err, scenarios) {
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

exports.create = function (req, res) {
	var deviceId = req.params.deviceId;
	var scenario = new UScenario(req.body);
	var tasks = req.body.tasks;

	UDevice.findOne({ id: deviceId }).exec(function (err, device) {
		if (err) {
			return res.status(500).json({
				status: false,
				error: err
			});
		}

		if (device) {
			scenario.id = uuid.v1();
			scenario._device = device._id;
			scenario._user = req.user._id;
			scenario.save(function (err) {
				if (err) {
					return res.status(500).json({
						status: false,
						error: err
					});
				}

				UScenario.emit('create', req.user, scenario);

				if (tasks) {
					var tasksIt = 0;

					_(tasks).forEach(function (taskObj) {

						var conditions = taskObj.conditions;
						var task = new UTask(taskObj);

						task.id = uuid.v1();
						task._scenario = scenario._id;
						task._user = req.user._id;
						task.save(function (err) {
							if (err) console.log('Error: ', err);
							tasksIt++;
							//UTask.emit('create', req.user, task);

							if (conditions) {
								var conditionsSize = conditions.length;
								var conditionsIt = 0;

								_(conditions).forEach(function (conditionObj) {
									var condition = new UCondition(conditionObj);

									condition.id = uuid.v1();
									condition._task = task._id;
									condition._user = req.user._id;
									condition.save(function (err) {
										if (err) console.log('Error: ', err);
										conditionsIt++;
										if (conditionsIt >= conditionsSize) {
											UCondition.emit('create', req.user, condition);
										}
									});
								});
							}
						});
					});
				}

				res.json({
					status: true,
					error: null,
					scenario: scenario
				});
			});
		}
	});
};

exports.update = function (req, res) {
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
			var l = new Logs({
				type: Logs.LOGTYPE.Scenario,
				severity: Logs.LOGSEVERITY.Normal,
				message: 'Scenario \'' + scenario.name + '\' was updated.',
				id: scenario.id,
				timestamp: Date.now()
			});

			l.save(function (err) {
				if (err) console.log('Error saving the scenario update log');
			});

			res.json({
				status: true,
				error: null,
				scenario: scenario
			});
		}
	);
};

exports.destroy = function (req, res) {
	var scenarioId = req.params.scenarioId;

	UScenario.findOne({ id: scenarioId }, function (err, scenario) {
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

exports.show = function (req, res) {
	var scenarioId = req.params.scenarioId;

	UScenario.findOne({ id: scenarioId }, function (err, scenario) {
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

exports.enable = function (req, res) {
	var scenarioId = req.params.scenarioId;

	UScenario.findOneAndUpdate(
		{ id: scenarioId },
		{ enabled: true },
		function (err, scenario) {
			if (err) {
				return res.status(500).json(500, {
					status: false,
					error: err
				});
			}

			UScenario.emit('enable', req.user, scenario);

			res.json({
				status: true,
				error: null,
				scenario: scenario
			});
		}
	);
};