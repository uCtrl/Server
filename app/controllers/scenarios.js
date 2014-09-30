'use strict';

var _ = require('lodash');
var ninjaBlocks = require(__base + 'app/apis/ninjablocks.js');
var ninja = new ninjaBlocks( {userAccessToken:global.uctrl.ninja.userAccessToken} );
var mongoose = require('mongoose');
var uplatform = mongoose.model('UPlatform');
var uscenario = mongoose.model('UScenario');

exports.all = function(req, res) {
	// We'll use DB later. For now, let's return the rules or a Default scenario when mapping will be done
	uplatform.findOne({id : req.params.platformId}, function(err, platformObj){
		platformObj.devices.forEach(function(deviceObj){
			if(deviceObj.id == req.params.deviceId){
				res.json(deviceObj.scenarios);
			}
		});
	});
	/*
	ninja.rules(function(err, data){
		res.json(data);
	});
	*/
};

exports.create = function(req, res) {
	uplatform.findOne({id : req.params.platformId}, function(err, platformObj){
		platformObj.devices.forEach(function(deviceObj, deviceIndex){
			if(deviceObj.id == req.params.deviceId){
				var obj = new uscenario(req.body);
				platformObj.devices[deviceIndex].scenarios.push(obj);
				platformObj.save();
				res.json("created");
			}
		});
	});
};

exports.update = function(req, res) {
	var scenarioId = req.params["scenarioId"];

	ninja.rule(deviceId).update(req.body, function(err, data){
		if (err) {
      		return res.json(500, {
       			error: 'Cannot update the scenario ' + scenarioId
      		});
    	}   	
    	res.json(data);
	});
};


exports.destroy = function(req, res) {
	uplatform.findOne({id : req.params.platformId}, function(err, platformObj){
		platformObj.devices.forEach(function(deviceObj, deviceIndex){
			if(deviceObj.id == req.params.deviceId){
				deviceObj.scenarios.forEach(function(scenarioObj, scenarioIndex){
					if(scenarioObj.id == req.params.scenarioId){
						platformObj.devices[deviceIndex].scenarios.remove(scenarioObj._id.toString());
						platformObj.save();
						res.json("destroyed");
					}
				});
			}
		});
	});

	/*
	ninja.rule(scenarioId).delete(function(err, data) {
		if (err) {
      		return res.json(500, {
       			error: 'Cannot delete the scenario ' + scenarioId
      		});
    	}   	
    	res.json(data);
	});	
	
	*/
};

exports.show = function(req, res) {
	uplatform.findOne({id : req.params.platformId}, function(err, platformObj){
		platformObj.devices.forEach(function(deviceObj, deviceIndex){
			if(deviceObj.id == req.params.deviceId){
				deviceObj.scenarios.forEach(function(scenarioObj, scenarioIndex){
					if(scenarioObj.id == req.params.scenarioId){
						res.json(scenarioObj);
					}
				});
			}
		});
	});

	/*
	ninja.rule(scenarioId, function(err, data) {
		if (err) {
      		return res.json(500, {
       			error: 'Cannot find the scenario ' + scenarioId
      		});
    	}   	
    	res.json(data);

		//TODO Get scenarios from mongoDB
		//output.size = size;
		res.json(output);
	});	
	*/
};