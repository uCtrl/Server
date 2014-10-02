'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
	UPlatform = mongoose.model('UPlatform');

exports.all = function(req, res) {
	UPlatform.find().sort('id').exec(function(err, platforms) {
		if (err) {
			return res.json(500, {
				error: err//"Can't list the platforms"
			});
	    }
		res.json(platforms);
	});
};

exports.create = function(req, res) {
	var platform = new UPlatform(req.body);
	platform.save(function(err) {
		if (err) {
			return res.json(500, {
				error: err//"Can't create the platform"
			});
		}
		res.json(platform);
	});
	// Pair + activate is enough? Needs testing
};

exports.update = function(req, res) {
	var platformId = req.params.platformId;

	UPlatform.findOne({ id: platformId }, function(err, platform) { 
		if (err) {
			return res.json(500, {
				error: err//"Can't find platform " + platformId + " to update"
			});
		}
		platform = _.extend(platform, req.body);
		platform.save(function(err) {
			if (err) {
				return res.json(500, {
					error: err//"Can't update platform " + platformId
				});
			}
			res.json(platform);
		});
	});
};

exports.destroy = function(req, res) {
	var platformId = req.params.platformId;

	UPlatform.findOne({ id: platformId }, function(err, platform) {
		if (err) {
			return res.json(500, {
				error: err//"Can't delete platform " + platformId
			});
		}
		res.json(platform.remove());
	});
};

exports.show = function(req, res) {
	var platformId = req.params.platformId;

	UPlatform.findOne({ id: platformId }, function(err, platform) {
	    if (err) {
			return res.json(500, {
				error: err//"Can't retrieve platform " + platformId
			});
		}		
	    res.json(platform);
	});
};

UPlatform.on('created', function(id) {
	console.log('Created ' + id);
});

UPlatform.on('updated', function(id) {
	console.log('Updated');
});

UPlatform.on('removed', function(id) {
	console.log('Removed ' + id);
});