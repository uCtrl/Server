'use strict';

var _ = require('lodash');
var ninjaBlocks = require(__base + 'app/apis/ninjablocks.js');
var ninja = new ninjaBlocks( {userAccessToken:global.uctrl.ninja.userAccessToken} );
var mongoose = require('mongoose');
var udevice = mongoose.model('UDevice');
var uplatform = mongoose.model('UPlatform');


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

exports.all = function(req, res) {
	uplatform.findOne({id : req.params.platformId}, function(err, platformObj){
		res.json(platformObj.devices);
	});
	console.log(udevice.schema);
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
	var obj = new udevice(req.body);
	uplatform.findOne({id : req.params.platformId}, function(err, platformObj){
		if(!err){
			platformObj.devices.push(obj);
			platformObj.save();
			res.json("created");
		}
	});
};

exports.update = function(req, res) {
	uplatform.findOne({id : req.params.platformId}, function(err, platformObj){
		if(!err){
			_.each(platformObj.devices, function(obj, index){
				if(obj.id == req.params.deviceId){
					platformObj.devices[index] = req.body;
					platformObj.save();
					res.json("updated");
				}
			});
		}
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
	uplatform.findOne({id : req.params.platformId}, function(err, platformObj){
		if(!err){
			//BOB HERE
			//_.each(platformObj.devices, function(obj, index){
			//	if(obj.id == req.params.deviceId){
					platformObj.devices.id("5429bf3810a916842063a6b6").remove();
					platformObj.save();
					res.json("destroyed");
			//	}
			//});
		}
	});	
    
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
	uplatform.findOne({id : req.params.platformId}, function(err, platformObj){
		if(!err){
			_.each(platformObj.devices, function(obj, index){
				if(obj.id == req.params.deviceId){
					res.json(obj);
				}
			});
		}
	});
/*
	ninja.device(req.params.deviceId, function(err, data) {
		if (err) {
      		return res.json(500, {
       			error: 'Cannot find the device ' + deviceId
      		});
    	}   	
    	res.json(data);
	});	
	*/
};

