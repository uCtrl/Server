'use strict';

var uuid = require('node-uuid'),
	mongoose = require('mongoose'),
	UScenario = mongoose.model('UScenario'),
	UTask = mongoose.model('UTask'),
	UCondition = mongoose.model('UCondition'),
	Recommendations = mongoose.model('Recommendations');

exports.read = function(req, res) {
	Recommendations.find({ _user: req.user._id, accepted: null }, function(err, recommendations) {
		if (err) {
			return res.status(500).json({
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
	var recommendationId = req.params.recommendationId;

	Recommendations.findOneAndUpdate(
		{ id: recommendationId }, 
		req.body,
		function (err, rec) {
			if (err) {
				return res.status(500).json({
					status: false,
					error: err
				});
			}
			
			if (rec.accepted) {
				console.log("Creating scenario!");
				createScenario(rec, req.user);
			}

			res.json({
				status: true,
				error: null,
				recommendation: rec
			});
		}
	);
};

var createScenario = function(recommendation, user) {
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
                _device: recommendation.deviceId,
                _user: user._id
            });
            scenario.save(function(err, s) {
                if (err) {
                	console.log(err);
                	return;
                }

                UScenario.emit('create', user, s);
                createElseTask(s, user);
                createTask(s, recommendation, user);
            });
		} else {
			createTask(scenario, recommendation, user);
		}
	});
};

var createElseTask = function(scenario, user) {
	var elseTask = new UTask({
		id: uuid.v1(),
		value: '0',
		enabled: true,
		_scenario: scenario._id,
		_user: user._id
	});

	elseTask.save(function(err, t) {
        if (err) {
        	console.log(err);
        	return;
        }
        UTask.emit('create', user, t);
    });
};

var createTask = function(scenario, recommendation, user) {
	var task = new UTask({
		id: uuid.v1(),
		value: recommendation.taskValue,
		enabled: true,
		_scenario: scenario._id,
		_user: user._id
	});

	task.save(function(err, t) {
        if (err) {
        	console.log(err);
        	return;
        }
        console.log("Task: ", t);
        UTask.emit('create', user, t);

        createCondition(t, recommendation, user);
    });
};

var createCondition = function(task, recommendation, user) {
	var condition = new UCondition({
		id: uuid.v1(),
		type: recommendation.conditionType,
		comparisonType: recommendation.conditionComparisonType,
		beginValue: recommendation.conditionBeginValue,
		endValue: recommendation.conditionEndValue,
		deviceId: recommendation.conditionDeviceId,
		_task: task._id,
		_user: user._id
	});

	condition.save(function(err, c) {
        if (err) {
        	console.log(err);
        	return;
        }
        UCondition.emit('create', user, c);
    });
};