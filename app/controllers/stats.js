'use strict';

var mongoose = require('mongoose');
var Stats = mongoose.model('Stats');
var _ = require('lodash');


var asd = [{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.1,"type":31,"timestamp":1417106602923,"_id":"547754ab0afdec2b3db1d5b7","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.1,"type":31,"timestamp":1417106603112,"_id":"547754ab0afdec2b3db1d5b8","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.1,"type":31,"timestamp":1417106603324,"_id":"547754ab0afdec2b3db1d5bb","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.5,"type":31,"timestamp":1417106783250,"_id":"5477555f0afdec2b3db1d5c0","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.5,"type":31,"timestamp":1417106783381,"_id":"5477555f0afdec2b3db1d5c1","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417106842942,"_id":"5477559b0afdec2b3db1d5c6","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417106844116,"_id":"5477559c0afdec2b3db1d5c8","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417106902936,"_id":"547755d60afdec2b3db1d5ce","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.5,"type":31,"timestamp":1417106962959,"_id":"547756130afdec2b3db1d5d3","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.5,"type":31,"timestamp":1417106964301,"_id":"547756140afdec2b3db1d5d6","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.5,"type":31,"timestamp":1417107022985,"_id":"5477564f0afdec2b3db1d5db","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.5,"type":31,"timestamp":1417107023834,"_id":"5477564f0afdec2b3db1d5dd","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.5,"type":31,"timestamp":1417107082921,"_id":"5477568b0afdec2b3db1d5e3","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.5,"type":31,"timestamp":1417107084404,"_id":"5477568c0afdec2b3db1d5e5","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417107142975,"_id":"547756c70afdec2b3db1d5e9","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417107143458,"_id":"547756c70afdec2b3db1d5ed","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417107202937,"_id":"547757030afdec2b3db1d5f1","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417107204250,"_id":"547757040afdec2b3db1d5f3","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417107262990,"_id":"5477573f0afdec2b3db1d5f7","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417107263564,"_id":"5477573f0afdec2b3db1d5f9","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.5,"type":31,"timestamp":1417107322952,"_id":"5477577b0afdec2b3db1d5fd","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.5,"type":31,"timestamp":1417107324435,"_id":"5477577c0afdec2b3db1d5ff","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.5,"type":31,"timestamp":1417107382916,"_id":"547757b60afdec2b3db1d603","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.5,"type":31,"timestamp":1417107383126,"_id":"547757b70afdec2b3db1d605","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.5,"type":31,"timestamp":1417107383700,"_id":"547757b70afdec2b3db1d607","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.6,"type":31,"timestamp":1417107442983,"_id":"547757f30afdec2b3db1d60c","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.6,"type":31,"timestamp":1417107444375,"_id":"547757f40afdec2b3db1d60f","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.6,"type":31,"timestamp":1417107502946,"_id":"5477582e0afdec2b3db1d614","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.6,"type":31,"timestamp":1417107503703,"_id":"5477582f0afdec2b3db1d616","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.6,"type":31,"timestamp":1417107563090,"_id":"5477586b0afdec2b3db1d61a","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.6,"type":31,"timestamp":1417107563300,"_id":"5477586b0afdec2b3db1d61c","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.6,"type":31,"timestamp":1417107622976,"_id":"547758a60afdec2b3db1d62a","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.6,"type":31,"timestamp":1417107624457,"_id":"547758a80afdec2b3db1d62c","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.6,"type":31,"timestamp":1417107682937,"_id":"547758e20afdec2b3db1d636","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.6,"type":31,"timestamp":1417107683148,"_id":"547758e30afdec2b3db1d638","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.6,"type":31,"timestamp":1417107683359,"_id":"547758e30afdec2b3db1d63a","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.5,"type":31,"timestamp":1417107742928,"_id":"5477591e0afdec2b3db1d63e","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.5,"type":31,"timestamp":1417107743139,"_id":"5477591f0afdec2b3db1d640","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.5,"type":31,"timestamp":1417107743350,"_id":"5477591f0afdec2b3db1d642","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.5,"type":31,"timestamp":1417107802951,"_id":"5477595a0afdec2b3db1d645","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.5,"type":31,"timestamp":1417107804069,"_id":"5477595c0afdec2b3db1d647","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417107863004,"_id":"547759970afdec2b3db1d64b","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417107863395,"_id":"547759970afdec2b3db1d64d","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417107922966,"_id":"547759d20afdec2b3db1d653","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417107923449,"_id":"547759d30afdec2b3db1d655","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417107983008,"_id":"54775a0f0afdec2b3db1d657","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417108042938,"_id":"54775a4a0afdec2b3db1d65f","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417108043149,"_id":"54775a4b0afdec2b3db1d662","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417108043360,"_id":"54775a4b0afdec2b3db1d664","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417108103020,"_id":"54775a870afdec2b3db1d673","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417108103412,"_id":"54775a870afdec2b3db1d675","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417108162981,"_id":"54775ac30afdec2b3db1d680","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417108163377,"_id":"54775ac30afdec2b3db1d682","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.1,"type":31,"timestamp":1417108223125,"_id":"54775aff0afdec2b3db1d686","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.1,"type":31,"timestamp":1417108282967,"_id":"54775b3a0afdec2b3db1d68a","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.1,"type":31,"timestamp":1417108342990,"_id":"54775b760afdec2b3db1d68e","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.1,"type":31,"timestamp":1417108343473,"_id":"54775b770afdec2b3db1d690","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.1,"type":31,"timestamp":1417108402952,"_id":"54775bb30afdec2b3db1d694","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.1,"type":31,"timestamp":1417108403163,"_id":"54775bb30afdec2b3db1d696","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.1,"type":31,"timestamp":1417108463096,"_id":"54775bef0afdec2b3db1d69a","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.1,"type":31,"timestamp":1417108463397,"_id":"54775bef0afdec2b3db1d69c","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.1,"type":31,"timestamp":1417108523035,"_id":"54775c2b0afdec2b3db1d6a1","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.1,"type":31,"timestamp":1417108523428,"_id":"54775c2b0afdec2b3db1d6a3","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.1,"type":31,"timestamp":1417108582996,"_id":"54775c660afdec2b3db1d6a7","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.1,"type":31,"timestamp":1417108583479,"_id":"54775c670afdec2b3db1d6a9","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.1,"type":31,"timestamp":1417108642958,"_id":"54775ca20afdec2b3db1d6ad","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.1,"type":31,"timestamp":1417108643168,"_id":"54775ca30afdec2b3db1d6af","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.1,"type":31,"timestamp":1417108643387,"_id":"54775ca30afdec2b3db1d6b1","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417108703018,"_id":"54775cdf0afdec2b3db1d6b6","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417108703592,"_id":"54775cdf0afdec2b3db1d6b8","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.1,"type":31,"timestamp":1417108762979,"_id":"54775d1a0afdec2b3db1d6bc","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.1,"type":31,"timestamp":1417108763463,"_id":"54775d1b0afdec2b3db1d6be","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417108823033,"_id":"54775d570afdec2b3db1d6c2","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417108823606,"_id":"54775d570afdec2b3db1d6c4","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417108882982,"_id":"54775d920afdec2b3db1d6cc","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417108883637,"_id":"54775d930afdec2b3db1d6ce","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.1,"type":31,"timestamp":1417108943026,"_id":"54775dcf0afdec2b3db1d6d2","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.1,"type":31,"timestamp":1417108943691,"_id":"54775dcf0afdec2b3db1d6d4","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.1,"type":31,"timestamp":1417109002988,"_id":"54775e0b0afdec2b3db1d6d8","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.1,"type":31,"timestamp":1417109003198,"_id":"54775e0b0afdec2b3db1d6db","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.1,"type":31,"timestamp":1417109003682,"_id":"54775e0b0afdec2b3db1d6dd","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.1,"type":31,"timestamp":1417109063049,"_id":"54775e470afdec2b3db1d6e2","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.1,"type":31,"timestamp":1417109063621,"_id":"54775e470afdec2b3db1d6e4","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.1,"type":31,"timestamp":1417109123008,"_id":"54775e830afdec2b3db1d6e8","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.1,"type":31,"timestamp":1417109123673,"_id":"54775e830afdec2b3db1d6ea","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417109184932,"_id":"54775ec00afdec2b3db1d6f4","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.1,"type":31,"timestamp":1417109243207,"_id":"54775efb0afdec2b3db1d6fb","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417109303208,"_id":"54775f370afdec2b3db1d700","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417109303691,"_id":"54775f370afdec2b3db1d702","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417109363004,"_id":"54775f720afdec2b3db1d707","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417109363759,"_id":"54775f730afdec2b3db1d709","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.5,"type":31,"timestamp":1417109423057,"_id":"54775faf0afdec2b3db1d70d","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.5,"type":31,"timestamp":1417109423721,"_id":"54775faf0afdec2b3db1d70f","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.5,"type":31,"timestamp":1417109483018,"_id":"54775feb0afdec2b3db1d713","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.5,"type":31,"timestamp":1417109543042,"_id":"547760270afdec2b3db1d717","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.5,"type":31,"timestamp":1417109543797,"_id":"547760270afdec2b3db1d719","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.5,"type":31,"timestamp":1417109603003,"_id":"547760620afdec2b3db1d71d","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.5,"type":31,"timestamp":1417109603214,"_id":"547760630afdec2b3db1d71f","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.5,"type":31,"timestamp":1417109603789,"_id":"547760630afdec2b3db1d721","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.6,"type":31,"timestamp":1417109662995,"_id":"5477609e0afdec2b3db1d725","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.6,"type":31,"timestamp":1417109663205,"_id":"5477609f0afdec2b3db1d727","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.6,"type":31,"timestamp":1417109663779,"_id":"5477609f0afdec2b3db1d729","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.5,"type":31,"timestamp":1417109723076,"_id":"547760db0afdec2b3db1d72d","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.5,"type":31,"timestamp":1417109727372,"_id":"547760df0afdec2b3db1d72f","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.5,"type":31,"timestamp":1417109783198,"_id":"547761170afdec2b3db1d734","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.5,"type":31,"timestamp":1417109783864,"_id":"547761170afdec2b3db1d736","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417109843071,"_id":"547761530afdec2b3db1d73a","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.3,"type":31,"timestamp":1417109843826,"_id":"547761530afdec2b3db1d73c","__v":0},{"id":"19168710-75d8-11e4-9b4c-833d799d141c","data":23.5,"type":31,"timestamp":1417109903192,"_id":"5477618f0afdec2b3db1d741","__v":0}];

exports.read = function(req, res) {

	var reduceByInterval = function(results, interval) {
		if (!results || !interval || !/\d+/.test(interval) || !results[0])
			return results;

		var nbInterval = interval.match(/\d+/g)[0];
		var step = 0;
		switch(true) {
			case /min/.test(interval):
				step = nbInterval * 60;
				break;
			case /hour/.test(interval): 
				step = nbInterval * 3600;
				break;
			case /day/.test(interval): 
				step = nbInterval * 86400;
				break;
			case /week/.test(interval): 
				step = nbInterval * 604800;
				break;
			case /month/.test(interval): 
				step = nbInterval * 18144000;
				break;
			case /year/.test(interval): 
				step = nbInterval * 217728000;
				break;
		}

		step *= 1000;

		var fromTimestamp = results[0].timestamp;

		var reducedResults = _.reduce(results, function(dict, stat) {
			var key = Math.floor((stat.timestamp - fromTimestamp) / step);		
			dict[key] = dict[key] || [];
			dict[key].push(Number(stat.data));

			return dict;
		}, {});

		var keys = _.keys(reducedResults);

		_.forEach(keys, function(key) {
			var ts = intervalToTimestamp(interval, key, nbInterval, fromTimestamp);
			reducedResults[ts] = reducedResults[key];
			delete reducedResults[key];
		});

		return reducedResults;
	};

	var intervalToTimestamp = function(type, interval, nbInterval, fromTimestamp) {
		switch(true) {
			case /min/.test(type):
				interval *= 60;
				break;
			case /hour/.test(type): 
				interval *= 3600;
				break;
			case /day/.test(type): 
				interval *= 86400;
				break;
			case /week/.test(type): 
				interval *= 604800;
				break;
			case /month/.test(type): 
				interval *= 18144000;
				break;
			case /year/.test(type): 
				interval *= 217728000;
				break;
		}
		return fromTimestamp + (interval * 1000 * nbInterval);
	};

	var getCount = function(results) {
		return results.length;
	};

	var getMax = function(results) {
		return _.max(results);
	};

	var getMin = function(results) {
		return _.min(results);
	};

	var getMean = function(results) {
		var sum = _.reduce(results, function(s, data) {
			return s + data;
		});
		return sum / results.length;
	};

	var sendStatistic = function(result) {
		res.json({
			status: true,
			error: null,
			data: String(Math.round(result * 100) / 100)
		});
	};

	var sendStatistics = function(results) {
		var s = _.map(results, function(obj) {
			obj.data = String(Math.round(obj.data * 100) / 100);
			delete obj["id"];
			delete obj["type"];
			return obj;
		});

		res.json({
			status: true,
			error: null,
			data: s
		});
	};

	var option = {};

	// If we want the stats for a specifid device
	if (req.params.deviceId) 
		option["id"] = req.params.deviceId;

	if (req.query.from) {
		option["timestamp"] = option["timestamp"] || {};
		option["timestamp"]["$gte"] = req.query.from;
	}

	if (req.query.to) {
		option["timestamp"] = option["timestamp"] || {};
		option["timestamp"]["$lte"] = req.query.to;
	}

	Stats.find(option).sort({timestamp: 'ascending'}).exec(function(err, results) {
		if (err) {
			res.status(500).json({
				status: !err,
				error: err
			});
			return;
		}
		
		if (req.query.interval) {
			results = reduceByInterval(results, req.query.interval);
			console.log(results);
			results = _.forEach(results, function(val, key) {
				if (req.query.fn == "max") {
					results[key] = getMax(val);
				} else if (req.query.fn == "min") {
					results[key] = getMin(val);
				} else if (req.query.fn == "count") {
					results[key] = getCount(val);
				} else { // MEAN
					results[key] = getMean(val);
				}
			});

			results = _.reduce(results, function (arr, val, key) {
				arr.push({
					"data": val,
					"timestamp": Number(key)
				});
				return arr;
			}, []);


			sendStatistics(results);
			return;
		}

		// Not interval -> with function
		if (req.query.fn) {
			results = _.pluck(results, 'data');
			if (req.query.fn == "max") {
				sendStatistic(getMax(results));
			} else if (req.query.fn == "min") {
				sendStatistic(getMin(results));
			} else if (req.query.fn == "mean") {
				sendStatistic(getMean(results));
			} else if (req.query.fn == "count") {
				sendStatistic(getCount(results));
			}
			return;
		}

		// No parameters
		sendStatistics(results);
		return;
	});
};
