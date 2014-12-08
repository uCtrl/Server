'use strict';

var mongoose = require('mongoose'),
	Logs = mongoose.model('Log');

exports.read = function (req, res) {
	var columns = 'id type severity message timestamp',
		request = Logs.find({ timestamp: {'$gte': req.query.from || 0, '$lt': req.query.to || Date.now()} });

	if (req.params.deviceId) request.where('id').equals(req.params.deviceId);
	if (req.query.type) request.where('type').equals(req.query.type);

	request
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