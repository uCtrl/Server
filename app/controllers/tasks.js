'use strict';

var _ = require('lodash');
var ninjaBlocks = require(__base + 'app/apis/ninjablocks.js');
var ninja = new ninjaBlocks( {userAccessToken:global.uctrl.ninja.userAccessToken} );
var mongoose = require('mongoose');
var uplatform = mongoose.model('UPlatform');
var utask = mongoose.model('UTask');

/*
var msg = {
	"messageType": 8,
	"status": true,
	"error" : null,
	"scenarioId": req.params.scenarioId,
	"size": 0,
	"tasks": []
};
*/
		
exports.all = function(req, res) {
	// We'll use DB later. For now, let's return the rules
	uplatform.findOne({id : req.params.platformId}, function(err, platformObj){
		platformObj.devices.forEach(function(deviceObj, deviceIndex){
			if(deviceObj.id == req.params.deviceId){
				deviceObj.scenarios.forEach(function(scenarioObj, scenarioIndex){
					if(scenarioObj.id == req.params.scenarioId){
						res.json(scenarioObj.tasks);
					}
				});
			}
		});
	});
	
	/*
	ninja.rules(function(err, data){
		//res.json(data);
		var out = [];
		_.each(data, function(el){
			//filter actions for the device. We will use only one action by task (action[0])
			if(el.actions[0].params.guid == deviceId)
			{
				out.push({
					id : el.rid,
					type : "TODO: " + el.actions[0].handler,	//ninjaSendCommand
					name : "TODO: " + el.shortName,				//name the task
					status : el.actions[0].params.da,
				});
			}
		});
		res.json(out);
	});
	*/
};

exports.create = function(req, res) {
	uplatform.findOne({id : req.params.platformId}, function(err, platformObj){
		platformObj.devices.forEach(function(deviceObj, deviceIndex){
			if(deviceObj.id == req.params.deviceId){
				deviceObj.scenarios.forEach(function(scenarioObj, scenarioIndex){
					if(scenarioObj.id == req.params.scenarioId){
						var obj = new utask(req.body);
						platformObj.devices[deviceIndex].scenarios[scenarioIndex].tasks.push(obj);
						platformObj.save();
						res.json("created");
					}
				});
			}
		});
	});
	/*
	ninja.rule().create(req.body, function(err, data){
		if (err) {
      		return res.json(500, {
       			error: 'Cannot create the task'
      		});
    	} 
		res.json(data);
	});
	*/
};

exports.update = function(req, res) {
	var taskId = req.params["taskId"];

	ninja.rule(deviceId).update(req.body, function(err, data){
		if (err) {
      		return res.json(500, {
       			error: 'Cannot update the task ' + taskId
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
						scenarioObj.tasks.forEach(function(taskObj, taskIndex){
							if(taskObj.id == req.params.taskId){
								platformObj.devices[deviceIndex].scenarios[scenarioIndex].tasks.remove(taskObj._id.toString());
								platformObj.save();
								res.json("destroyed");
							}
						});
					}
				});
			}
		});
	});

	/*
	ninja.rule(taskId).delete(function(err, data) {
		if (err) {
      		return res.json(500, {
       			error: 'Cannot delete the task ' + taskId
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
						scenarioObj.tasks.forEach(function(taskObj, taskIndex){
							if(taskObj.id == req.params.taskId){
								res.json(taskObj);
							}
						});
					}
				});
			}
		});
	});

	/*
	ninja.rule(taskId, function(err, data) {
		if (err) {
      		return res.json(500, {
       			error: 'Cannot find the task ' + taskId
      		});
    	}
	});	
	*/
};