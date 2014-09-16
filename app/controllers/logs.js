'use strict';

var mongoose = require('mongoose');
var Logs = mongoose.model('Log');

exports.read = function(req, res) {
	if (!req.params.deviceId) {
		Logs.find(function (err, logs) {
			res.json(logs);
		});
	} else {
		Logs.find({ deviceId: req.params.deviceId }, function (err, logs) {
			res.json(logs);
		});
	}
};

exports.create = function(req, res) {
	var log = new Logs({
		type: req.body.type,
		deviceId: req.body.deviceId,
		newValue: req.body.newValue,
		timestamp: Date.now()
	});

	log.save( function( err ) {
		if( !err ) {
			console.log( 'created' );
			return res.send( log );
		} else {
			console.log( err );
			return res.send('ERROR');
		}
	});
};