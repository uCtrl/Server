'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var utask = mongoose.model('UTask');
		
exports.all = function(req, res) {
	utask.all(req, function(data){
		res.json(data);
	});
	utask.fromNinjaBlocks.all(req, function(data){
		console.log(data);
	});
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
	utask.fromNinjaBlocks.show(req, function(data){
		console.log(data);
	});
};