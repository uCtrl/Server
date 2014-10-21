'use strict';
var Pusher = require('pusher-client'),
    _ = require('lodash');

console.log("Starting Pusher monitor...");

var pusher = new Pusher('ccff70362850caf79c9f');
var channel = pusher.subscribe('0511a894f99712072bebefe21be4bf971c24888d');

// SUBSCRIPTION
channel.bind('pusher:subscription_succeeded',
  function(data) {
  }
);

// DATA
var dataController = require('../controllers/pusher/data.js');
channel.bind('data', dataController.save);

// CONFIG - Seems to be sent when playing around in the interface without applying new rules
channel.bind('config',
  function(data) {
  	console.log('New CONFIG. ');
  }
);

// STREAM
var streamController = require('../controllers/pusher/stream.js');
channel.bind('stream', streamController.save);