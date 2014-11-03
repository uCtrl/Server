'use strict';

var mongoose = require('mongoose');
var Logs = mongoose.model('Log');

exports.read = function(req, res) {
	Logs.find(function (err, logs) {
		res.json(logs);
	});
};