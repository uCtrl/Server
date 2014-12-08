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

#### Install Node.js
1. Go to the [Node.js download](http://nodejs.org/download/) page and get the last **Source Code** version.
2. Create the folder **/var/opt/nodejs** (`sudo mkdir /var/opt/nodejs`)
3. Extract the Node.js archive in the **var/opt/nodejs** folder (`tar -zxvf node-vx.xx.xx.tar.gz` then `sudo mv node-vx.xx.xx /var/opt/nodejs`)
4. `sudo apt-get install build-essential`
5. `cd /var/opt/nodejs`
6. `sudo ./configure`
7. `sudo make`
8. `sudo make install`
9. And, optionally, for the documentation : `sudo make doc`

#### Install MongoDB
Execute :
* `sudo npm install gulp -g`
* `npm install`

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

### Install on Windows

#### Install Node.js

1. Go to the [official website](http://nodejs.org/download/) and download the Windows version of Node.js.
2. Run the installation script (.exe or .msi) you just download and follow the installation steps.

#### Install MongoDB

1. Go to the [official website](http://www.mongodb.org/downloads) and download the Windows version of MongoDB.
2. Run the installation script (.exe or .msi) you just download and follow the installation steps.

____

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
