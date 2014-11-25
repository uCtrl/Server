'use strict';

var mongoose = require('mongoose');
var Logs = mongoose.model('Log');

exports.read = function(req, res) {
	var columns = 'id type severity message timestamp';

	Logs.find({
		timestamp: {"$gte": req.query.from || 0, "$lt": req.query.to || Date.now()}
	})
	.select(columns)
	.exec(function (err, logs) {
		if (err) {
			res.status(500).json({
				status: !err,
				error: err,
				history: logs
			});
		} else {
			res.json({
				status: !err,
				error: err,
				history: logs
			});
		}
	});
};
