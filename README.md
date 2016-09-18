# visitingLandmarks

## Run It
1. Install node.js (>=6.0.0)
2. Install grunt-cli 
    ```
    npm install -g grunt-cli
    ```
3. Install dependencies
    ```
    npm install
    ```
4. Setup an local config file (config/local.js) and configure your DB endpoint
    ```javascript
    module.exports = {
        mongoDB:{
            connectURI: 'mongodb://user:password@server:port/db'
        }
    };
    ```
5. Pack client files
    ```
    grunt webpack
    ```
6. Start the server
    ```
    node server
    ```
    
## Test It
There are several grunt tasks for different quality checks. Easiest is you just run `grunt`

## TechStack

#### Frontend
* React
* Redux
* Radium

#### Communication
* socket.io

#### TaskRunner / Building
* Grunt
* Webpack
* Babel
* Apache Cordova / Adobe Phonegap

#### Testing
* Mocha
* Chai
* Sinon

#### Backend + DB
* Node.js
* Express
* MongoDB
* Mongoose

#### Map / Geolocation
* Leaflet.js

#### Graphic Icon
* House by Vishwas Shetty from the Noun Project
