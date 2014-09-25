'use strict';

var _ = require('lodash'),
    ninjaBlocks = require(__base + 'app/apis/ninjablocks.js'),
    ninja = new ninjaBlocks( {userAccessToken:global.uctrl.ninja.userAccessToken} );

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
	var platformId = req.params["platformId"];
	var deviceId = req.params["deviceId"];
	var scenarioId = req.params["scenarioId"];
	
	ninja.rules(function(err, data){
		//res.json(data);
		var out = [];
		_.each(data, function(el){
			//filter actions for the device. We will use only one action by task (action[0])
			if(el.actions[0].params.guid == deviceId)
			{
				out.push({
					id : el.rid,
					type : "TODO: " + el.actions[0].handler,
					name : "TODO: " + el.shortName,
					status : el.actions[0].params.da,
				});
			}
		});
		res.json(out);
	});
};

exports.create = function(req, res) {
	ninja.rule().create(req.body, function(err, data){
		if (err) {
      		return res.json(500, {
       			error: 'Cannot create the task'
      		});
    	} 
		res.json(data);
	});
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
	var taskId = req.params["taskId"];

	ninja.rule(taskId).delete(function(err, data) {
		if (err) {
      		return res.json(500, {
       			error: 'Cannot delete the task ' + taskId
      		});
    	}   	
    	res.json(data);
	});	
};

exports.show = function(req, res) {
	var platformId = req.params["platformId"];
	var deviceId = req.params["deviceId"];
	var scenarioId = req.params["scenarioId"];
	var taskId = req.params["taskId"];

	ninja.rule(taskId, function(err, data) {
		if (err) {
      		return res.json(500, {
       			error: 'Cannot find the task ' + taskId
      		});
    	}
	});	
};