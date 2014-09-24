'use strict';
var _ = require('lodash');
var NinjaBlocks = require('../apis/ninjablocks.js');
var ninja = new NinjaBlocks({userAccessToken:"107f6f460bed2dbb10f0a93b994deea7fe07dad5"});

var TemperatureId;
var HumidityId;
var StatuslightId;
var OnBoardLedId;
var NinjaEyesId;
var RfDevicesId;

exports.get = function(req, res) {
	

	var output = {
		"numberofdevices": 0,
		"devices": []
	};
	
	ninja.devices(function(err, result){
		var size = 0;


		_.each(result, function(el, index){
			size++;
			
			output.devices.push({
				"id": index,
				"name": el.default_name,
				"type": el.device_type,	//TODO : translate
			});

			if (el.default_name == "Temperature"){
				TemperatureId = index;
			}
			else if (el.default_name == "Humidity"){
				HumidityId = index;
			}
			else if (el.default_name == "Status Light"){
				StatuslightId = index;
			}
			else if (el.default_name == "On Board RGB LED"){
				OnBoardLedId = index;
			}
			else if (el.default_name == "Nina's Eyes"){
				NinjaEyesId = index;
			}
			else if (el.default_name == "RF 433Mhz"){
				RfDevicesId = index;
			}

		});

		output.numberofdevices = size;
		res.json(output);
	});

};




exports.getTemperature = function(req, res) {
	

	var output = {
		"TemperatureId": TemperatureId,
		"device": []
	};
	
	ninja.device(TemperatureId, function(err, result){
		var size = 0;


		_.each(result, function(el, index){
			size++;
			
			output.device.push({
				"id": TemperatureId,
				"vid": el.vid,
				"did": el.did,
				"gid": el.gid,
				"guid": el.guid,
				"node": el.node,
				"device_type": el.device_type,
				"default_name": el.default_name,
				"shortName": el.shortName,
				"tags": el.tags,
				"is_sensor": el.is_sensor,
				"is_actuator": el.is_actuator,
				"is_silent": el.is_silent,
				"has_time_series": el.has_time_series,
				"has_subdevice_count": el.has_subdevice_count,
				"has_state": el.has_state,
				"unit": el.unit,
				"documentation": el.documentation,
				"last_data": el.last_data
			});
		});
		output.size = size;
		res.json(output);
	});

};



exports.getNinjaEyes = function(req, res) {
	

	var output = {
		"NinjaEyesId": NinjaEyesId,
		"device": []
	};
	
	ninja.device(NinjaEyesId, function(err, result){
		var size = 0;


		_.each(result, function(el, index){
			size++;
			
			output.device.push({
				"id": NinjaEyesId,
				"vid": el.vid,
				"did": el.did,
				"gid": el.gid,
				"guid": el.guid,
				"node": el.node,
				"device_type": el.device_type,
				"default_name": el.default_name,
				"shortName": el.shortName,
				"tags": el.tags,
				"is_sensor": el.is_sensor,
				"is_actuator": el.is_actuator,
				"is_silent": el.is_silent,
				"has_time_series": el.has_time_series,
				"has_subdevice_count": el.has_subdevice_count,
				"has_state": el.has_state,
				"unit": el.unit,
				"documentation": el.documentation,
				"last_data": el.last_data
			});
		});
		output.size = size;
		res.json(output);
	});

};




/*
var TRANSLATOR = {
	"":"",
	"":"",
	"":"",
	"equality":"beginValue",
	"":""
};
_.each(result, function(el){
				
			})
    jsonObj["id"] = getId();
    jsonObj["type"] = (int) getType();
    jsonObj["comparisonType"] = (int) getComparisonType();
	
    case UEConditionType::Date (1)
		jsonObj["beginDate"] = m_beginDate.toString(Qt::DateFormat::ISODate);
		jsonObj["endDate"] = m_endDate.toString(Qt::DateFormat::ISODate);
    case UEConditionType::Time:
		jsonObj["beginTime"] = m_beginTime.toString("hh:mm");
		jsonObj["endTime"] = m_endTime.toString("hh:mm");
    case UEConditionType::Day:
        jsonObj["selectedWeekdays"] = getSelectedWeekdays();
    case UEConditionType::Device:		
		jsonObj["deviceType"] = (int)getDeviceType();
		jsonObj["deviceId"] = getDeviceId();
		jsonObj["beginValue"] = getBeginValue();
		jsonObj["endValue"] = getEndValue();
	
*/