'use strict';

var mongoose = require('mongoose');
var Logs = mongoose.model('Log');
var	UTask = mongoose.model('UTask');


exports.save = function(data) {
	// Find the equivalent task that was executed.
	var name = /"(.*)" Exec/g.exec(data.message);
	console.log("FROM NINJA: " + data.message);
	name = name? name[1] : "";
	
	UTask.findOne({
		name: name
	})
	.exec(function (err, task) {
		if (err) console.log("Error finding related task that was executed on Ninja.");

		if (task) {
			//console.log(task);
			var l = new Logs({
				type: Logs.LOGTYPE.Action, 
				severity: Logs.LOGSEVERITY.Normal,  
				message: "Task '" + task.name + "'' was executed.",
				timestamp: Date.now()
			});

			l.save(function(err) {
				if (err) console.log("Error saving the task execution event log.");
				//else console.log("Task execution saved.");
			})

		} else {
			//console.log ("No task found with rule name: ");
		}
	});
};
