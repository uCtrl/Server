'use strict';

var mongoose = require('mongoose');
var Stats = mongoose.model('Stats');
var _ = require('lodash');

exports.read = function(req, res) {
	var columns = 'id data type timestamp';

	if (req.query.fn == "count") {
		Stats.count({}, function(err, count) {
			res.json({
				status: !err,
				error: err,
				count: count
			});
		});
		return;
	}

	var request = Stats.find( { timestamp: {"$gte": req.query.from || 0, "$lt": req.query.to || Date.now()} });
	if (req.params.deviceId) request.where('id').equals(req.params.deviceId);
	request.select(columns)
	.exec(function (err, stats) {
		if (err) {
			res.status(500).json({
				status: !err,
				error: err,
				statistics: stats
			});
		} else {
			if (req.query.fn == "mean") {
				var datas = _.pluck(stats, 'data');
				var mean = _.reduce(datas, function(sum, num) {
					return sum + num;
				});
				mean /= stats.length;

				res.json({
					status: !err,
					error: err,
					mean: mean
				});
			} 
			else if (req.query.fn == "max") {
				var max = _.max(stats, 'data');
				res.json({
					status: !err,
					error: err,
					max: max.data
				});
			} 
			else if (req.query.fn == "min") {
				var min = _.min(stats, 'data');
				res.json({
					status: !err,
					error: err,
					min: min.data
				});
			} else {
				res.json({
					status: !err,
					error: err,
					statistics: stats
				});
			}
		}
	});
};
