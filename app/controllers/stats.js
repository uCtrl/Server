'use strict';

var mongoose = require('mongoose');
var Stats = mongoose.model('Stat');

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
	var stat = new Stats({

		/* TODO: CHANGE THE STATS DEPENDING ON COMING SCHEMA */

		// type: req.body.type,
		// deviceId: req.body.deviceId,
		// value: req.body.value,
		// timestamp: Date.now()
	});

	stat.save( function( err ) {
		if( !err ) {
			console.log( 'created' );
			return res.status(200).send( stat );
		} else {
			console.log( err );
			return res.status(500).send('ERROR');
		}
	});
};