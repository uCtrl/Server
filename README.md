# µCtrl-Server

This repository contains the core components of the Server service released under the µCtrl source project. 

For now, server will only collect statistics out the devices in µCtrl system.

## Getting started

### Prerequisites

* Node.js - Download and Install [node.js][nodejs]. You can also follow [this gist][HowToInstallNode] for a quick and easy way to install Node.js and npm
* MongoDB - Download and Install [MongoDB][mongodb] - Make sure it's running on the default port (27017).

### Quick Install for Macintosh users

There's a script in `script/bootstrap-mac`. It will make you have Homebrew, Node.js and MongoDB installed. If not, it will install them. After, it will install all dependencies, so the only command to run is `gulp`.

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