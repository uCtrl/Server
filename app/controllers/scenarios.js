'use strict';

var _ = require('lodash'),
    ninjaBlocks = require(__base + 'app/apis/ninjablocks.js'),
    ninja = new ninjaBlocks( {userAccessToken:"107f6f460bed2dbb10f0a93b994deea7fe07dad5"} );


exports.all = function(req, res) {
	// We'll use DB later. For now, let's return the rules or a Default scenario when mapping will be done
	ninja.rules(function(err, data){
		res.json(data);
	});
};

exports.create = function(req, res) {
	ninja.rules
	res.text("...");
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
	var scenarioId = req.params["scenarioId"];

	ninja.rule(scenarioId).delete(function(err, data) {
		if (err) {
      		return res.json(500, {
       			error: 'Cannot delete the scenario ' + scenarioId
      		});
    	}   	
    	res.json(data);
	});	
};

exports.show = function(req, res) {
	var scenarioId = req.params["scenarioId"];

	ninja.rule(scenarioId, function(err, data) {
		if (err) {
      		return res.json(500, {
       			error: 'Cannot find the scenario ' + scenarioId
      		});
    	}   	
    	res.json(data);
	});	
};