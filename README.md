# visitingLandmarks

## Demo
You can find the lateast stable build at http://visitinglandmarks.com

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
    
4. Get a 3.x MongoDB
5. Setup an local config file (config/local.js) and configure your DB endpoint

    ```javascript
    module.exports = {
        mongoDB:{
            connectURI: 'mongodb://user:password@server:port/db'
        }
    };
    ```
    
6. Pack client files

    ```
    grunt webpack:dev
    ```
    
7. Start the server

    ```
    node server
    ```
    
8. Point your browser to http://localhost:8001
    
## Test It
There are several grunt tasks for different quality checks. Easiest is you just run `grunt`

## TechStack

For details have a look at the package.json.

#### Frontend
* React
* Redux

#### Communication
* socket.io

#### TaskRunner / Building
* Grunt
* Webpack
* Babel
* Apache Cordova / Adobe PhoneGap

#### UserManagement
* passport.js
* express-session
* connect-mongo

#### Testing
* Mocha
* Chai
* Sinon

#### Backend and DB
* Node.js
* Express
* Mongoose
* MongoDB

#### Map / Geolocation
* Leaflet
* Leaflet MarkerCluster

## Licenses

#### Code

The MIT License

#### Locations

There is no data shipped with the repository. Have a look into the importData folder for import scripts.
The project is designed to work with any kind of location based data.

#### Graphics
* "House" by Vishwas Shetty from the Noun Project
* "User Placeholder" by Freepik from www.flaticon.com  (http://www.flaticon.com/free-icon/user-placeholder_22966)
