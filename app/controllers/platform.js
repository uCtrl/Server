'use strict';
var _ = require('lodash');
var fs = require("fs");
var NinjaBlocks = require('../apis/ninjablocks.js');
var ninja = new NinjaBlocks({userAccessToken:"107f6f460bed2dbb10f0a93b994deea7fe07dad5"});

var block = {"nodeId": 0};
var chaine;

exports.get = function(req, res) {
	var output = {
		"NumberOfBlocks": 0,
		"blocks": []
	};
	
	ninja.blocks(function(err, result){
		var size = 0;
		console.log(result);
		_.each(result, function(el, index){
			size++;
			output.blocks.push({
				"id": index
			});
			block.nodeId = index;
			console.log(block.nodeId);
		});
		output.NumberOfBlocks = size;
		res.json(output);
		
	});


};





