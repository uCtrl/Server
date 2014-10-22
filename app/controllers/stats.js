'use strict';

var mongoose = require('mongoose');
var Stats = mongoose.model('Stats');

exports.read = function(req, res) {
	var columns = 'id data type timestamp';

	if (!req.query.deviceId) {
		Stats.find({
			timestamp: {"$gte": req.query.from || 0, "$lt": req.query.to || Date.now()}
		})
		.select(columns)
		.exec(function (err, stats) {
			res.json(stats);
		});
	} else {
		Stats.find({ 
			id: req.query.deviceId,
			timestamp: {"$gte": req.query.from || 0, "$lt": req.query.to || Date.now()} 
		})
		.select(columns)
		.exec(function (err, stats) {
			if (err) console.log('error1');
			res.json(stats);
		});
	}
};
