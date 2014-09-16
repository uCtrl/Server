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

	deviceId: { type: Number, required: true},
	deviceType: { type: String, required:true},
	timestamp: { type: Number, required: true},
	ampere: { type: Number, required: true},
	data: { type: Number, required: true},
	value: { type: Object, required:true}

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

exports.render = function(req, res) {
	Stats.find(function (err, Stats) {
		res.json(Stats);
	});
};