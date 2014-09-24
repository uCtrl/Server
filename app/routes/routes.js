'use strict';

module.exports = function(app) {
    // Home route
    var index = require('../controllers/index');
    app.get('/', index.render);


    var logs = require('../controllers/logs.js');
    app.get('/logs', logs.read);
    app.get('/logs/:deviceId', logs.read);
    app.post('/logs', logs.create);

	//System
	//Platform
    var platform = require('../controllers/platform.js');
        // Route to get Block informations (ID)
        app.get('/platform', platform.get); 
    
	
    //Device
    var device = require('../controllers/device.js');
        // Route to get all the devices connected (ID + Name + type)
        app.get('/device', device.get);
        // Route to get the temperature device informations
        app.get('/device/temperature', device.getTemperature); 
        // Route to get the ninja eyes informations
        app.get('/device/ninjaEyes', device.getNinjaEyes);
        // Route to get the humidity device informations
     /* app.get('/device/humidity', device.getHumidity); 
        // Route to get the statuslight  informations
        app.get('/device/statuslight', device.getStatuslight);  
        // Route to get the on board led  informations
        app.get('/device/onBoardLed', device.getOnBoardLed);  
        app.get('/device/rfdevices', device.getRfDevices); 
        */

	    


    //Scenario
	var scenario = require('../controllers/scenario.js');
    app.get('/scenario', scenario.get);
    app.get('/scenario/:deviceId', scenario.get);
	

    //Task
	var task = require('../controllers/task.js');
    app.get('/task', task.get);
    app.get('/task/:scenarioId', task.get);
	

    //Condition
	var condition = require('../controllers/condition.js');
    app.get('/condition', condition.get);
    app.get('/condition/:taskId', condition.get);


};