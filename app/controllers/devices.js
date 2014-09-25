'use strict';

var _ = require('lodash'),
    ninjaBlocks = require(__base + 'app/apis/ninjablocks.js'),
    ninja = new ninjaBlocks( {userAccessToken:"107f6f460bed2dbb10f0a93b994deea7fe07dad5"} );

/* We'll need to think about the subdevices and what to do exactly with them */

exports.all = function(req, res) {
	ninja.devices(function(err, data){
		if (err) {
      		return res.json(500, {
       			error: 'Cannot retrieve the devices'
      		});
    	} 
		res.json(data);
	});
};

exports.create = function(req, res) {
	// (FRY) Not sure if it's possible, may be for subdevices
	res.text("...");
};

exports.update = function(req, res) {
	var deviceId = req.params["deviceId"];

	ninja.device(deviceId).update(req.body, function(err, data){
		if (err) {
      		return res.json(500, {
       			error: 'Cannot update the device ' + deviceId
      		});
    	}   	
    	res.json(data);
	});
};


exports.destroy = function(req, res) {
	var deviceId = req.params["deviceId"];

	ninja.device(deviceId).delete(function(err, data) {
		if (err) {
      		return res.json(500, {
       			error: 'Cannot delete the device ' + deviceId
      		});
    	}   	
    	res.json(data);
	});	
};

exports.show = function(req, res) {
	var deviceId = req.params["deviceId"];

	ninja.device(deviceId, function(err, data) {
		if (err) {
      		return res.json(500, {
       			error: 'Cannot find the device ' + deviceId
      		});
    	}   	
    	res.json(data);
	});	
};