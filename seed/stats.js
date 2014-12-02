'use strict';

(function() { process.env.NODE_ENV = 'development'; })();

var config = require(__dirname + '/../config/config.js'),
_ = require('lodash'),
mongoose = require('mongoose'),
Q = require('q'),
async = require('async'),
UPlatform = mongoose.model('UPlatform'),
UDevice = mongoose.model('UDevice'),
UScenario = mongoose.model('UScenario'),
UTask = mongoose.model('UTask'),
UCondition = mongoose.model('UCondition'),
Stats = mongoose.model('Stats'),
Logs = mongoose.model('Log');

module.exports = function() {




    Q.ninvoke(mongoose,'connect', config.db)
    .then(function () {
        var now = Date.now();
        var days = _.map([0,1,2,3,4,5,6,7], function (x) { return x* 24* 3600 * 1000;});
        var hours = [];
        for (i = 0; i < 24; i++) { 
            hours.push(i * 3600*1000);
        }
        var mins = [];
        for (var i = 0; i < 60; i++) { 
            mins.push(i * 1000);
        }

        function makeTimestamps() {
            var timestamps = _.map(days, function(d) {
                return _.map(hours, function(h) {
                    var rand = _.random(0,7);
                    var wentBy = [];
                    for (var i=0; i < rand; i++) {
                        wentBy[i] = _.random(0, mins[20]) + h + d;
                    }
                    return wentBy;
                });
            });
            timestamps = _.sortBy(_.map(_.flatten(timestamps), function(x) {
                return now - x;
            }));
            return timestamps;
        }


        async.waterfall([
            function getDevices(cb){
                UDevice.find(function(err, devices){
                    cb(err, devices);
                });
            },

            function fillDoors(devices, cb) {
                var ids = [
                    '1014BBBK6089_0_0_11:111101010101011101010000',
                    '1014BBBK6089_0_0_11:110100110101010100110000',
                    '1014BBBK6089_0_0_11:010101011111000101010000',
                    '1014BBBK6089_0_0_11:010111010100011100110000',
                    '1014BBBK6089_0_0_11:010000010101110101010000',
                    '1014BBBK6089_0_0_11:110111011101010101010000'];

                async.each(ids, function(id, callback_id) {
                    var door = _.find(devices, {tpId: id });
                    var timestamps = makeTimestamps();
                    async.each(timestamps, function(t, callback_t) {
                        var o = new Stats({
                            id: door.id,
                            data: door.value,
                            type: 11,
                            timestamp: t
                        });
                        o.save(function(err, o){
                            callback_t(err);
                        });
                    }, function (err) {
                        if (err) callback_id(err);
                        callback_id(null);
                    });
                }, function(err) {
                    cb(err, devices);
                });
            },

            function fillSomethingElse(devices, cb) {
                console.log("fill something else");

            }],

            function(err, results) {
                if (err) console.log ("Error seeding stats and logs", err);
                console.log("Done seeding stats.");
            });
    })
    .catch(function(err) {
        console.log(err);
    });
};



