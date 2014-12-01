'use strict';

var path = require('path');
var rootPath = path.normalize(__dirname + '/../..');
var fs = require('fs');

module.exports = {
	root: rootPath,
	port: process.env.PORT || 80,
	db: process.env.MONGOHQ_URL
};

//global variables
global.uctrl = {};
global.uctrl.target = 'ninja';

//global variables - for ninja target
global.uctrl.ninja = {};
global.uctrl.ninja.userTpId = "fc9a001d-3ae9-11e4-b6c8-12313b088d3a";
global.uctrl.ninja.userName = "uCtrl";
global.uctrl.ninja.userEmail = "uctrl@outlook.com";
global.uctrl.ninja.userAccessToken = "107f6f460bed2dbb10f0a93b994deea7fe07dad5";
global.uctrl.ninja.pusherChannelToken = "0511a894f99712072bebefe21be4bf971c24888d";

var models_path = __dirname + '/../../app/models';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);

require(rootPath + '/app/apis/ninjacrawler.js');