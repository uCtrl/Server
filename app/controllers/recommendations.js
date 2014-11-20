'use strict';

var mongoose = require('mongoose');
var Recommendations = mongoose.model('Recommendations');

exports.read = function(req, res) {
	Recommendations.find().sort('id').exec(function(err, recommendations) {
		if (err) {
			return res.json(500, {
				status: false,
				error: err
			});
	    }
		
		res.json({
			status: true,
			error: null,
			recommendations: recommendations
		});
	});
}

exports.accept = function(req, res) {
	var recommendation = res.body;
	if (!recommendation.accepted) {
		return res.json({
			status: true,
			error: null
		});
	}

	Recommendation.findOne({'id': recommendation.id}, function (err, rec) {
		if (err) {
        	console.log(err);
        	return;
        }

        createScenario(rec);
	});
};



var createScenario = function(recommendation) {
	UScenario.findOne({'_device': recommendation.deviceId, 'name': "Recommendations"}, function(err, scenario) {
		if (err) {
        	console.log(err);
        	return;
        }

		if (!scenario) {
			scenario = new UScenario({
                id: uuid.v1(),
                name: "Recommendations",
                enabled: true,
                _device: recommendation.deviceId
            });
            scenario.save(function(err, s) {
                if (err) {
                	console.log(err);
                	return;
                }

                // emit Scenario
                createElseTask(s);
                createTask(s, recommendation);
            });
		} else {
			createTask(scenario, recommendation);
		}
	});
};

var createElseTask = function(scenario) {
	var elseTask = new UTask({
		id: uuid.v1(),
		value: '0',
		enabled: true,
		_scenario: scenario._id
	});

	elseTask.save(function(err, s) {
        if (err)
        	console.log(err);
        // emit Task
    });
};

var createTask = function(scenario, recommendation) {
	var task = new UTask({
		id: uuid.v1(),
		value: recommendation.taskValue,
		enabled: true,
		_scenario: scenario._id
	});

	task.save(function(err, t) {
        if (err) {
        	console.log(err);
        	return;
        }
        // emit Task

        createCondition(t, recommendation);
    });
};

var createCondition = function(task, recommendation) {
	var condition = new UCondtion({
		id: uuid.v1(),
		type: recommendation.conditionType,
		comparisonType: recommendation.conditionComparisonType,
		beginValue: recommendation.conditionBeginValue,
		endValue: recommendation.conditionEndValue,
		deviceId: recommendation.conditionDeviceId
	});

	condition.save(function(err, c) {
        if (err) {
        	console.log(err);
        	return;
        }
        // emit Condition
    });
};