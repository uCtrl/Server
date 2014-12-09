# µCtrl-Server

This repository contains the core components of the Server service released under the µCtrl source project. 

To know more about what this server does and how it's made, visit our [Jira Confluence][jiraConfluenceServer]

## Getting started

### Prerequisites

* Node.js - Download and Install [node.js][nodejs]. You can also follow [this gist][HowToInstallNode] for a quick and easy way to install Node.js and npm
* MongoDB - Download and Install [MongoDB][mongodb] - Make sure it's running on the default port (27017).

### Quick Install for Macintosh users

There's a script in `script/bootstrap-mac`. It will make you have Homebrew, Node.js and MongoDB installed. If not, it will install them. After, it will install all dependencies, so the only command to run is `gulp`. *You might (or not) need to Download and Install [gulp][gulp] yourself.*

### Start the server

Clone the repo:
`git clone git@github.com:uCtrl/Server.git`

Install dependencies:

`$ npm install`

Then you can gulp to start the server:

`$ gulp`

Gulp offers you file monitoring and other useful services, but you can start without it: 

`$ node server.js`

Then open a browser and go to:

`http://localhost:3000`

[nodejs]: http://nodejs.org/
[HowToInstallNode]: https://gist.github.com/isaacs/579814
[mongodb]: http://www.mongodb.org/
[jiraConfluenceServer]: https://curuba.atlassian.net/wiki/pages/viewpage.action?pageId=11796534
[gulp]: https://github.com/gulpjs/gulp/
