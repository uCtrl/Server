'use strict';

var _ = require('lodash');
var ninjaBlocks = require(__base + 'app/apis/ninjablocks.js');
var ninja = new ninjaBlocks( {userAccessToken:global.uctrl.ninja.userAccessToken} );
var mongoose = require('mongoose');
var utask = mongoose.model('UTask');
		
exports.all = function(req, res) {
	utask.all(req, function(data){
		res.json(data);
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
	utask.create(req, function(data){
		res.json(data);
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
	utask.update(req, function(data){
		res.json(data);
	});
	
	/*
	ninja.rule(deviceId).update(req.body, function(err, data){
		if (err) {
      		return res.json(500, {
       			error: 'Cannot update the task ' + taskId
      		});
    	}   	
    	res.json(data);
	});
	*/
};


exports.destroy = function(req, res) {
	utask.destroy(req, function(data){
		res.json(data);
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
	utask.show(req, function(data){
		res.json(data);
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

/*
var msg = {
	"messageType": 8,
	"status": true,
	"error" : null,
	"scenarioId": req.scenarioId,
	"size": 0,
	"tasks": []
};
*/