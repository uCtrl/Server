'use strict';

var mongoose = require('mongoose');
var Logs = mongoose.model('Log');
var	UTask = mongoose.model('UTask');


exports.save = function(data) {

	// Find the equivalent task that was executed.
	var name = /"(.*)" Exec/g.exec(data.message);
	name = name? name[1] : "";
	
	UTask.find({
		name: name
	})
	.exec(function (err, task) {
		if (task.length) {
			var o = new Logs({
				type: "Rule",
				target: task.id,
				timestamp: data.timestamp || Date.now()
			});
			o.save();

			Logs.emit('Rule', o);
		} else {
			// console.log ("no task found with rule name: ", name);
		}
	});
};

