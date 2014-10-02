'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var ucondition = mongoose.model('UCondition');

exports.all = function (req, res) {
	ucondition.all(req, function(data){
		res.json(data);
	});
	ucondition.fromNinjaBlocks.all(req, function(data){
		console.log(data);
	});
};

exports.create = function(req, res) {
	ucondition.create(req, function(data){
		res.json(data);
	});
	
	/*
	ninja.rule().create(req.body, function(err, data){
		if (err) {
      		return res.json(500, {
       			error: 'Cannot create the condition'
      		});
    	} 
		res.json(data);
	});
	*/
};

exports.update = function(req, res) {
	ucondition.update(req, function(data){
		res.json(data);
	});

	/*
	ninja.rule(conditionId).update(req.body, function(err, data){
		if (err) {
      		return res.json(500, {
       			error: 'Cannot update the condition ' + conditionId
      		});
    	}   	
    	res.json(data);
	});
	*/
};


exports.destroy = function(req, res) {
	ucondition.destroy(req, function(data){
		res.json(data);
	});
	
	/*
	ninja.rule(conditionId).delete(function(err, data) {
		if (err) {
      		return res.json(500, {
       			error: 'Cannot delete the condition ' + conditionId
      		});
    	}   	
    	res.json(data);
	});	
	
	*/
};

exports.show = function(req, res) {
	ucondition.show(req, function(data){
		res.json(data);
	});
	ucondition.fromNinjaBlocks.show(req, function(data){
		console.log(data);
	});
	/*
	ninja.rule(conditionId, function(err, data) {
		if (err) {
      		return res.json(500, {
       			error: 'Cannot find the condition ' + conditionId
      		});
    	}   	
    	res.json(data);
	});	
	*/
};

/*
OUTPUT FROM NINJA RULES : 
{
    "result": 1,
    "error": null,
    "id": 0,
    "data": [
        {
            "rid": 203053,
            "preconditions": [
                {
                    "handler": "ninjaThreshold",
                    "params": {
                        "guid": "1014BBBK6089_0101_0_31",
                        "equality": "GT",
                        "value": "20"
                    }
                }
            ],
            "actions": [
                {
                    "handler": "ninjaSendCommand",
                    "params": {
                        "guid": "1014BBBK6089_0_0_1007",
                        "da": "FF0000",
                        "shortName": "FF0000"
                    }
                }
            ],
            "store": {
                "_thresholdFlag_0": 1
            },
            "suspended": false,
            "shortName": "Bob's rule",
            "timeout": 2
        },
        {
            "rid": 203054,
            "preconditions": [
                {
                    "handler": "ninjaChange",
                    "params": {
                        "to": "110110101101101011011010",
                        "guid": "1014BBBK6089_0_0_11",
                        "shortName": "Socket 1 On"
                    }
                }
            ],
            "actions": [
                {
                    "handler": "ninjaSendCommand",
                    "params": {
                        "guid": "1014BBBK6089_0_0_1007",
                        "da": "FF00FF",
                        "shortName": "Purple"
                    }
                }
            ],
            "store": {},
            "suspended": false,
            "shortName": "bob's rule 2",
            "timeout": 2
        },
        {
            "rid": 203161,
            "preconditions": [
                {
                    "handler": "ninjaThreshold",
                    "params": {
                        "guid": "1014BBBK6089_0101_0_31",
                        "equality": "GT",
                        "value": "25"
                    }
                }
            ],
            "actions": [
                {
                    "handler": "ninjaSendCommand",
                    "params": {
                        "guid": "1014BBBK6089_0_0_1000",
                        "da": "FFFFFF",
                        "shortName": "FFFFFF"
                    }
                }
            ],
            "store": {},
            "suspended": false,
            "shortName": "bob's rule 3",
            "timeout": 2
        }
    ]
}
*/


