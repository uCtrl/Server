'use strict';

var _ = require('lodash'),
    ninjaBlocks = require(__base + 'app/apis/ninjablocks.js'),
    ninja = new ninjaBlocks( {userAccessToken:global.uctrl.ninja.userAccessToken} );

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

		//TODO Get scenarios from mongoDB
		//output.size = size;
		res.json(output);
	});	
};