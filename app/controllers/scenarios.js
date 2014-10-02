'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var uscenario = mongoose.model('UScenario');

exports.all = function(req, res) {
	uscenario.all(req, function(data){
		res.json(data);
	});
	//NO NINJA
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
};


exports.destroy = function(req, res) {
	uscenario.destroy(req, function(data){
		res.json(data);
	});
};

exports.show = function(req, res) {
	uscenario.show(req, function(data){
		res.json(data);
	});
};