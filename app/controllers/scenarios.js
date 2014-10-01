'use strict';

var _ = require('lodash');
var ninjaBlocks = require(__base + 'app/apis/ninjablocks.js');
var ninja = new ninjaBlocks( {userAccessToken:global.uctrl.ninja.userAccessToken} );
var mongoose = require('mongoose');
var uscenario = mongoose.model('UScenario');

exports.all = function(req, res) {
	uscenario.all(req, function(data){
		res.json(data);
	});
	
	/*
	ninja.rules(function(err, data){
		res.json(data);
	});
	*/
};

exports.create = function(req, res) {
	uscenario.create(req, function(data){
		res.json(data);
	});
	
};

exports.update = function(req, res) {
	uscenario.update(req, function(data){
		res.json(data);
	});

	/*
	ninja.rule(deviceId).update(req.body, function(err, data){
		if (err) {
      		return res.json(500, {
       			error: 'Cannot update the scenario ' + scenarioId
      		});
    	}   	
    	res.json(data);
	});
	*/
};


exports.destroy = function(req, res) {
	uscenario.destroy(req, function(data){
		res.json(data);
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
	uscenario.show(req, function(data){
		res.json(data);
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