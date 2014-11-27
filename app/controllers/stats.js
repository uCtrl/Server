'use strict';

var mongoose = require('mongoose');
var Stats = mongoose.model('Stats');
var _ = require('lodash');

exports.read = function(req, res) {

	var reduceByInterval = function(results, interval) {
		if (!results || !interval || !/\d+/.test(interval) || !results[0])
			return results;

		var nbInterval = interval.match(/\d+/g)[0];
		var step = 0;
		switch(true) {
			case /min/.test(interval):
				step = nbInterval * 60;
				break;
			case /hour/.test(interval): 
				step = nbInterval * 3600;
				break;
			case /day/.test(interval): 
				step = nbInterval * 86400;
				break;
			case /week/.test(interval): 
				step = nbInterval * 604800;
				break;
			case /month/.test(interval): 
				step = nbInterval * 18144000;
				break;
			case /year/.test(interval): 
				step = nbInterval * 217728000;
				break;
		}

		step *= 1000;

		var fromTimestamp = results[0].timestamp;

		var reducedResults = _.reduce(results, function(dict, stat) {
			var key = Math.floor((stat.timestamp - fromTimestamp) / step);		
			dict[key] = dict[key] || [];
			dict[key].push(Number(stat.data));

			return dict;
		}, {});

		var keys = _.keys(reducedResults);

		_.forEach(keys, function(key) {
			var ts = intervalToTimestamp(interval, key, nbInterval, fromTimestamp);
			reducedResults[ts] = reducedResults[key];
			delete reducedResults[key];
		});

		return reducedResults;
	};

	var intervalToTimestamp = function(type, interval, nbInterval, fromTimestamp) {
		switch(true) {
			case /min/.test(type):
				interval *= 60;
				break;
			case /hour/.test(type): 
				interval *= 3600;
				break;
			case /day/.test(type): 
				interval *= 86400;
				break;
			case /week/.test(type): 
				interval *= 604800;
				break;
			case /month/.test(type): 
				interval *= 18144000;
				break;
			case /year/.test(type): 
				interval *= 217728000;
				break;
		}
		return fromTimestamp + (interval * 1000 * nbInterval);
	};

	var getCount = function(results) {
		return results.length;
	};

	var getMax = function(results) {
		return _.max(results, function(num) { return Number(num); });
	};

	var getMin = function(results) {
		return _.min(results, function(num) { return Number(num); });
	};

	var getMean = function(results) {
		var sum = _.reduce(results, function(s, data) {
			return s + Number(data);
		}, 0);
		return sum / results.length;
	};

	var sendStatistic = function(result) {
		res.json({
			status: true,
			error: null,
			data: String(Math.round(result * 100) / 100)
		});
	};

	var sendStatistics = function(results) {
		var s = _.map(results, function(obj) {
			obj.data = String(Math.round(obj.data * 100) / 100);
			delete obj["id"];
			delete obj["type"];
			return obj;
		});

		res.json({
			status: true,
			error: null,
			data: s
		});
	};

	var sendNull = function(results) {
		res.json({
			status: true,
			error: null,
			data: null
		});
	}

	var option = {};

	// If we want the stats for a specifid device
	if (req.params.deviceId) 
		option["id"] = req.params.deviceId;

	if (req.query.from) {
		option["timestamp"] = option["timestamp"] || {};
		option["timestamp"]["$gte"] = req.query.from;
	}

	if (req.query.to) {
		option["timestamp"] = option["timestamp"] || {};
		option["timestamp"]["$lte"] = req.query.to;
	}

	Stats.find(option).sort({timestamp: 'ascending'}).exec(function(err, results) {
		if (err) {
			res.status(500).json({
				status: !err,
				error: err
			});
			return;
		}
		
		if (!_.isArray(results) || results.length === 0) {
			sendNull(results);
			return;
		}

		if (req.query.interval) {
			results = reduceByInterval(results, req.query.interval);
			results = _.forEach(results, function(val, key) {
				if (req.query.fn == "max") {
					results[key] = getMax(val);
				} else if (req.query.fn == "min") {
					results[key] = getMin(val);
				} else if (req.query.fn == "count") {
					results[key] = getCount(val);
				} else { // MEAN
					results[key] = getMean(val);
				}
			});

			results = _.reduce(results, function (arr, val, key) {
				arr.push({
					"data": val,
					"timestamp": Number(key)
				});
				return arr;
			}, []);


			sendStatistics(results);
			return;
		}

		// Not interval -> with function
		if (req.query.fn) {
			results = _.pluck(results, 'data');
			if (req.query.fn == "max") {
				sendStatistic(getMax(results));
			} else if (req.query.fn == "min") {
				sendStatistic(getMin(results));
			} else if (req.query.fn == "mean") {
				sendStatistic(getMean(results));
			} else if (req.query.fn == "count") {
				sendStatistic(getCount(results));
			}
			return;
		}

		// No parameters
		sendStatistics(results);
		return;
	});
};
