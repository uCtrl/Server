'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var udevice = mongoose.model('UDevice');

exports.all = function(req, res) {
	udevice.all(req, function(data){
		res.json(data);
	});
	udevice.fromNinjaBlocks.all(req, function(data){
		console.log(data);
	});
};

exports.create = function(req, res) {
	// (FRY) Not sure if it's possible, may be for subdevices
	udevice.create(req, function(data){
		res.json(data);
	});
};

exports.update = function(req, res) {
	udevice.update(req, function(data){
		res.json(data);
	});
    
	/*
	ninja.device(deviceId).update(req.body, function(err, data){
		if (err) {
      		return res.json(500, {
       			error: 'Cannot update the device ' + deviceId
      		});
    	}   	
    	res.json(data);
	});
	*/
};


exports.destroy = function(req, res) {
	udevice.destroy(req, function(data){
		res.json(data);
	});
	
	/*
	uplatform.findOne({id : req.platformId}, function(err, platformObj){
		if(!err){
			_.each(platformObj.devices, function(obj, index){
				if(obj.id == req.deviceId){
					platformObj.devices.id(obj._id).remove();
					platformObj.save();
					res.json("destroyed");
				}
			});
		}
	});	
    */
	/*
	ninja.device(deviceId).delete(function(err, data) {
		if (err) {
      		return res.json(500, {
       			error: 'Cannot delete the device ' + deviceId
      		});
    	}   	
    	res.json(data);
	});	
	*/
};

exports.show = function(req, res) {
	udevice.show(req, function(data){
		res.json(data);
	});
	udevice.fromNinjaBlocks.show(req, function(data){
		console.log(data);
	});
};

//We'll need to think about the subdevices and what to do exactly with them