'use strict';

var mongoose = require('mongoose');
var Logs = mongoose.model('Log');
var	UTask = mongoose.model('UTask');
var	UDevice = mongoose.model('UDevice');
var	UScenario = mongoose.model('UScenario');


exports.save = function(data) {
	// Find the equivalent task that was executed.
	var name = /"(.*)" Exec/g.exec(data.message);
	console.log("FROM NINJA: " + data.message);
	name = name? name[1] : "";
	
	UTask.findOne({
		name: name
	})
	.populate('_scenario')
	.exec(function (err, task) {
		if (err) console.log("Error finding related task that was executed on Ninja.");

		if (task) {
			task._scenario.populate('_device', function(err, t) {
				if (err) console.log("Error populating the scenario's device");

				var l = new Logs({
					type: Logs.LOGTYPE.Action, 
					severity: Logs.LOGSEVERITY.Normal,  
					message: "Task '" + task.name + "'' was executed.",
					id: t._device.id,
					timestamp: Date.now()
				});

				l.save(function(err) {
					if (err) console.log("Error saving the task execution event log.");
				})
			});
		} else {
			console.log ("No task found");
		}
	});
};
