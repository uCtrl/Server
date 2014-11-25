'use strict';

var mongoose = require('mongoose');
var Stats = mongoose.model('Stats');
var _ = require('lodash');

exports.read = function(req, res) {
	var columns = 'id data type timestamp';

	if (req.query.fn == "count") {
		var request = Stats.count();
	} else {
		var request = Stats.find();
	}
	request.where({ timestamp: { "$gte": req.query.from || 0, "$lt": req.query.to || Date.now() }});
	if (req.params.deviceId) request = request.where('id').equals(req.params.deviceId);
	if (req.query.fn != "count") request = request.select(columns);

	request.exec(function (err, result) {
		if (err) {
			res.status(500).json({
				status: !err,
				error: err,
				statistics: result
			});
		} else {
			if (req.query.fn == "mean") {
				var datas = _.pluck(result, 'data');
				var mean = _.reduce(datas, function(sum, num) {
					return sum + num;
				});
				mean /= result.length;

				res.json({
					status: !err,
					error: err,
					mean: mean
				});
			} 
			else if (req.query.fn == "max") {
				var max = _.max(result, 'data');
				res.json({
					status: !err,
					error: err,
					max: max.data
				});
			} 
			else if (req.query.fn == "min") {
				var min = _.min(result, 'data');
				res.json({
					status: !err,
					error: err,
					min: min.data
				});
			} else if (req.query.fn == "count") {
				res.json({
					status: !err,
					error: err,
					count: result
				});
			} else {
				res.json({
					status: !err,
					error: err,
					statistics: result
				});
			}
		}
	});
};
