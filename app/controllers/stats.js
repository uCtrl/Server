'use strict';

var mongoose = require('mongoose');
var Stats = mongoose.model('Stats');
var _ = require('lodash');

exports.read = function(req, res) {
	if (req.query.fn == "lastUpdated") {
		var request = Stats.findOne({},{}, { sort: { 'timestamp' : -1 } });
		if (req.params.deviceId) request = request.where('id').equals(req.params.deviceId);

		request.exec(function(err, results) {
			if (err) res = res.status(500);
			res.json({
				status: !err,
				error: err,
				lastUpdated: results.timestamp
			});
		});
		return;
	} 

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
			return res.json({
				status: !err,
				error: err,
				statistics: result
			});
		}
		
		if (req.query.fn == "count") {
			res.json({
				status: !err,
				error: err,
				count: result.toString()
			});
		} else if (!result.length) {
			res.json({
				status: !err,
				error: err
			});
		} else if (req.query.fn == "mean") {
			var datas = _.pluck(result, 'data');
			var mean = _.reduce(datas, function(sum, num) {
				return sum + num;
			});
			mean /= result.length;

			res.json({
				status: !err,
				error: err,
				mean: mean.toString()
			});
		} 
		else if (req.query.fn == "max") {
			var max = _.max(result, 'data');
			res.json({
				status: !err,
				error: err,
				max: max.data.toString()
			});
		} 
		else if (req.query.fn == "min") {
			var min = _.min(result, 'data');
			res.json({
				status: !err,
				error: err,
				min: min.data.toString()
			});
		} else {
			var s = _.map(result, function(obj) {
				obj.data = obj.data.toString();
				return obj;
			})

			res.json({
				status: !err,
				error: err,
				statistics: s
			});
		}
	});
};