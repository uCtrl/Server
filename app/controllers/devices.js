'use strict';

var _ = require('lodash');
var ninjaBlocks = require(__base + 'app/apis/ninjablocks.js');
var ninja = new ninjaBlocks( {userAccessToken:global.uctrl.ninja.userAccessToken} );
var mongoose = require('mongoose');
var udevice = mongoose.model('UDevice');

exports.all = function(req, res) {
	udevice.all(req, function(data){
		res.json(data);
	});
	
	/*
	ninja.devices(function(err, data){
		if (err) {
      		return res.json(500, {
       			error: 'Cannot retrieve the devices'
      		});
    	} 
		res.json(data);
	});
	*/
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
/*
	ninja.device(req.deviceId, function(err, data) {
		if (err) {
      		return res.json(500, {
       			error: 'Cannot find the device ' + deviceId
      		});
    	}   	
    	res.json(data);
	});	
	*/
};

/* We'll need to think about the subdevices and what to do exactly with them */

/*
var output = {
	"messageType": 4,
	"status": true,
	"error" : null,
	"size": 0,
	"devices": []
};

_.each(result, function(el, index){
	size++;
	output.devices.push({
		"id": index,
		"maxValue": 0,
		"minValue": 0,
		"name": el.default_name,
		"precision": 0,			//TODO
		"type": el.device_type,	//TODO : translate
		"unitLabel": el.unit,	//TODO : translate
		"isTriggerValue": false	//TODO : ?
	});
});
output.size = size;
res.json(output);	
*/