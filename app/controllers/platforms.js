'use strict';

var _ = require('lodash'),
    ninjaBlocks = require(__base + 'app/apis/ninjablocks.js'),
    ninja = new ninjaBlocks( {userAccessToken:"107f6f460bed2dbb10f0a93b994deea7fe07dad5"} );

exports.all = function(req, res) {
	ninja.blocks(function(err, data){
		res.json(data);
	});
};

exports.create = function(req, res) {
	// Pair + activate is enough? Needs testing
	res.json("...");
};

exports.update = function(req, res) {
    // Can't update needs testing
    res.json("...");
};


exports.destroy = function(req, res) {
	var platformId = req.params["platformId"];

	ninja.block(platformId).delete(function(err, data) {
		if (err) {
      		return res.json(500, {
       			error: 'Cannot delete the platform' + platformId
      		});
    	}   	
    	res.json(data);
	});	
};

exports.show = function(req, res) {
	var platformId = req.params["platformId"];

	ninja.block(platformId, function(err, data) {
		if (err) 
			return next(new Error("Failed to find block " + id));
		res.json(data);
	});
};