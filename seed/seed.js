'use strict';

(function() { process.env.NODE_ENV = 'development'; })();
var config = require(__dirname + '/../config/config.js'),
	_ = require('lodash'),
	mongoose = require('mongoose'),
	Q = require('q'),
	UPlatform = mongoose.model('UPlatform'),
	UDevice = mongoose.model('UDevice'),
	UScenario = mongoose.model('UScenario'),
	UTask = mongoose.model('UTask'),
	UCondition = mongoose.model('UCondition'),
	seed = require(__dirname + '/data.json');

module.exports = function() {

	Q.ninvoke(mongoose,'connect', config.db)
	.then(function () {
		console.log('Wiping database...');
		return Q.ninvoke(mongoose.connection.db, 'dropDatabase');
	})
	.then(function () {
		console.log('Seeding database...')
		_.forEach(seed.platforms, function(platform) {
			var clonedPlatform = _.clone(platform, true);
			delete clonedPlatform.devices;
			var dbPlatform = new UPlatform(clonedPlatform);
			dbPlatform.save(function(err) { if (err) throw new Error(err); });

			_.forEach(platform.devices, function(device) {
				var clonedDevice = _.clone(device, true);
				delete clonedDevice.scenarios;
				clonedDevice["_platform"] = dbPlatform._id;
				var dbDevice = new UDevice(clonedDevice);
				dbDevice.save(function(err) { if (err) throw new Error(err); });
				
				_.forEach(device.scenarios, function(scenario) {
					var clonedScenario = _.clone(scenario, true);
					delete clonedScenario.tasks;
					clonedScenario["_device"] = dbDevice._id;
					var dbScenario = new UScenario(clonedScenario);
					dbScenario.save(function(err) { if (err) throw new Error(err); });

					_.forEach(scenario.tasks, function(task) {
						var clonedTask = _.clone(task, true);
						delete clonedTask.conditions;
						clonedTask["_scenario"] = dbScenario._id;
						var dbTask = new UTask(clonedTask);
						dbTask.save(function(err) { if (err) throw new Error(err); });

						_.forEach(task.conditions, function(condition) {
							var clonedCondition = _.clone(condition, true);
							clonedCondition["_task"] = dbTask._id;
							if (clonedCondition.beginTime) clonedCondition.beginTime = new Date(clonedCondition.beginTime);
							if (clonedCondition.endTime) clonedCondition.endTime = new Date(clonedCondition.endTime);
							if (clonedCondition.beginDate) clonedCondition.beginDate = new Date(clonedCondition.beginDate);
							if (clonedCondition.endDate) clonedCondition.endDate = new Date(clonedCondition.endDate);
							var dbCondition = new UCondition(clonedCondition);
							dbCondition.save(function(err) { if (err) throw new Error(err); });
						});
					});
				});
			});
		});
	})
	.then(function () {
		console.log('Finished. You may press ctrl-c');
	})
	.catch(function(err) {
		console.log(err);
	});
};



