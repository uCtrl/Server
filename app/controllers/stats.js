'use strict';

var mongoose = require('mongoose');
var Stats = mongoose.model('Stats');

exports.read = function(req, res) {
	var columns = 'id data type timestamp';

	Stats.find(
		req.query.deviceId ? 
		{ 
			id: req.query.deviceId,
			timestamp: {"$gte": req.query.from || 0, "$lt": req.query.to || Date.now()} 
		} :
		{
			timestamp: {"$gte": req.query.from || 0, "$lt": req.query.to || Date.now()}
		})
	.select(columns)
	.exec(function (err, stats) {
		res.json({
			status: !!err,
			error: err,
			statistics: stats
		});
	});
};
