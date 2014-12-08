'use strict';

var mongoose = require('mongoose');
var Logs = mongoose.model('Log'),
	UTask = mongoose.model('UTask'),
	UDevice = mongoose.model('UDevice'),
	UScenario = mongoose.model('UScenario'),
	UCondition = mongoose.model('UCondition');
var ninjablocks = require(__base + 'app/apis/ninjablocks.js');
var _ = require('lodash');

exports.save = function () {

	return function (data) {
		// Find the equivalent task that was executed.
		var name = /"(.*)" Exec/g.exec(data.message);
		console.log('FROM NINJA: ' + data.message);
		name = name ? name[1] : '';

		UTask.findOne({
			name: name
		})
			.populate('_scenario')
			.exec(function (err, task) {
				if (err) console.log('Error finding related task that was executed on Ninja.');

				function logTask(t) {
					t._scenario.populate('_device', function (err, scenario) {
						if (err) console.log('Error populating the scenario\'s device');

						var l = new Logs({
							type: Logs.LOGTYPE.Condition,
							severity: Logs.LOGSEVERITY.Normal,
							message: 'Task \'' + t.name + '\' was executed.',
							id: scenario._device.id,
							timestamp: Date.now()
						});

						l.save(function (err) {
							if (err) console.log('Error saving the task execution event log.');
						});
					});
				}

				if (task) {
					logTask(task);
				} else {
					console.log('No task found, GOOD TIME TO DYNAMICALLY LOAD THE TASK HELL YEAH I LUV MYSELF, YOLO.');
				}
			});
	};
};

function resolveTask(ruleName, user, callback) {
	var nb = new ninjablocks({userAccessToken: user.ninjablocks.userAccessToken});

	// fetch NinjaBlocks rules
	nb.rules(function (err, nbRules) {
		var nbRule = _.first(_.filter(nbRules, function (o) {
			return o.shortName === ruleName;
		}));

		var options = {};
		options.actionDevice = nbRule.actions[0].params.guid;
		options.actionValue = nbRule.actions[0].params.da;
		var m = /_(.*)$/.exec(options.actionDevice);
		if (m && m[1] === '11') { // is subdevice
			if (UDevice.isSwitch(nbRule.actions[0].params.da)) {
				options.actionDevice = nbRule.actions[0].params.guid + ':' + UDevice.switchOff(nbRule.actions[0].params.da);
				options.actionValue = UDevice.switchValue(nbRule.actions[0].params.da);
			} else {
				options.actionDevice = nbRule.actions[0].params.guid + ':' + nbRule.actions[0].params.da;
			}
		}

		UTask.fromNinjaBlocks(nbRule, nbRule.rid, function (task) {
			task.value = options.actionValue;
			UDevice.findOne({tpId: options.actionDevice}, function (err, device) {
				if (err) console.trace(err);
				if (device) {
					UScenario.findOne({_id: device._scenarios[0]}, function (err, scenario) {
						if (err) console.trace(err);
						task.parentId = scenario.id;
						task._scenario = scenario._id;
						task._user = user._id;

						_(nbRule.preconditions).forEach(function (preconditionObj, preconditionId) {
							UCondition.fromNinjaBlocks(preconditionObj, task.tpId + ':' + preconditionId, function (lstCondition) {
								task.save(function (err) {
									if (err) console.log(err);
									callback(task);
									_.forEach(lstCondition, function (cond) {
										cond.parentId = task.id;
										cond._user = user._id;
										cond.save(function (err) {
											if (err)console.log(err);
										});
									});
								});
							});
						});
					});
				}
			});
		});
	});
}
