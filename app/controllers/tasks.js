'use strict';

var _ = require('lodash'),
    ninjaBlocks = require(__base + 'app/apis/ninjablocks.js'),
    ninja = new ninjaBlocks( {userAccessToken:"107f6f460bed2dbb10f0a93b994deea7fe07dad5"} );


exports.all = function(req, res) {
	// We'll use DB later. For now, let's return the rules
	ninja.rules(function(err, data){
		res.json(data);
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
	var taskId = req.params["taskId"];

	ninja.rule(taskId, function(err, data) {
		if (err) {
      		return res.json(500, {
       			error: 'Cannot find the task ' + taskId
      		});
    	}   	
    	res.json(data);
	});	
};