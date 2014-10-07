'use strict';

var mongoose = require('mongoose');
var Stats = mongoose.model('Stats');

exports.read = function(req, res) {
	if (!req.params.deviceId) {
		Stats.find(function (err, stats) {
			res.json(stats);
		});
	} else {
		Stats.find({ deviceId: req.params.deviceId }, function (err, stats) {
			res.json(stats);
		});
	}
};

exports.create = function(req, res) {

	var stats = new Stats({
		// NINJA-related fields
		data: req.body.data,
		deviceId: req.body.deviceId,

		// Custom fields
		deviceType: req.body.deviceType,
		timestamp: Date.now()
	});


	stats.save( function( err ) {
		if( !err ) {
			console.log( 'created' );
			return res.status(200).send( stats );
		} else {
			console.log( err );
			return res.status(500).send('ERROR');
		}
	});
};