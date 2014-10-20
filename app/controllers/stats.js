'use strict';

var mongoose = require('mongoose');
var Stats = mongoose.model('Stats');

exports.read = function(req, res) {
	var columns = 'id data type timestamp';
	if (!req.params.deviceId) {
		Stats.find()
		.select(columns)
		.exec(function (err, stats) {
			res.json(stats);
		});
	} else {
		if (!req.params.beginDate || !req.params.endDate) {
			Stats.find({ id: req.params.deviceId })
			.select(columns)
			.exec(function (err, stats) {
				res.json(stats);
			});
		} else {
			Stats.find({ 
				id: req.params.deviceId, 
				timestamp: {"$gte": req.params.beginDate, "$lt": req.params.endDate} 
			})
			.select(columns)
			.exec(function (err, stats) {
				res.json(stats);
			});
		}
	}
};