[![Dependency Status](https://david-dm.org/uCtrl/Server.svg?style=flat)](https://david-dm.org/uCtrl/Server)

# µCtrl-Server

This repository contains the core components of the Server service released under the µCtrl source project.

For now, server will only collect statistics out the devices in µCtrl system.

## Getting started

### Prerequisites

* Node.js - Download and Install [node.js][nodejs]. You can also follow [this gist][HowToInstallNode] for a quick and easy way to install Node.js and npm
* MongoDB - Download and Install [MongoDB][mongodb] - Make sure it's running on the default port (27017).

### Quick Install for Macintosh users

There's a script in `script/bootstrap-mac`. It will make you have Homebrew, Node.js and MongoDB installed. If not, it will install them. After, it will install all dependencies, so the only command to run is `gulp`.

### Install on Ubuntu
Execute :
* `$ sudo npm install gulp -g`
* `$ npm install`

If you don't have MongoDB already install
* `sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10`
* `echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list`
* `sudo apt-get update`
* `sudo apt-get install -y mongodb-org`

Start
* `sudo service mongod start`

Stop
* `sudo service mongod stop`

Restart
* `sudo service mongod restart`

For more details, see [this link](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/).

### Start the server

The quickest way to get started with the project is to clone it and utilize it like this:

Install dependencies:

`$ npm install`

Then you can gulp to start the server:

`$ gulp`

When not using gulp you can use:

`$ node server.js`

Then open a browser and go to:

`http://localhost:3000`

[nodejs]: http://nodejs.org/
[HowToInstallNode]: https://gist.github.com/isaacs/579814
[mongodb]: http://www.mongodb.org/
