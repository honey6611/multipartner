require('events').EventEmitter.defaultMaxListeners = 10000;
var express = require('express');
var app = express();
// Include the cluster module
var cluster = require('cluster');
var prams, IIS = false

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var settings = require('./config');
//var timeStampInMs = document.performance && document.performance.now && document.performance.timing && document.performance.timing.navigationStart ? window.performance.now() + document.performance.timing.navigationStart : Date.now();
//http://localhost:2000/search/?sessionid=112323&AgentID=60042&CodeFrom=ALC&CodeTo=BEN&Adults=2&Children=0&Infants=0&FromDate=20180415&ToDate=20180428&FromTime=1400&ToTime=1200&FromLat=51.4703&FromLong=-0.45342&ToLat=50.8197675&ToLong=-1.0879769000000579&currencyid=GBP

// pass port number as env variable
// COMMAND : set port=<port number> node default
//const port = process.env.port || 3001;
const port = 3001;

// app.use('/', function (req, res, next) {
//     console.log('Request Type:', req.method)
//     next()
// })

if (cluster.isMaster) {
    // Code to run if we're in the master process
 
    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }   
}
else{
    // Code to run if we're in a worker process
    // controller
    app.use(require('./Controllers'))
     
    if(IIS){
        // below line to run it under iis
        app.listen(process.env.PORT)
    }
    else{
        // below code to run as a console app
        var server = app.listen(port, function (err) {
            //console.log(`Server is running at port ${port}. Worker ${cluster.worker.id} running!`);
            console.log(`Server is running at port ${port}.`);
        });
    }

    process.on('uncaughtException', function(err) {
        if(err.errno === 'EADDRINUSE')
             console.log('Port already in use');
        else
             console.log(err);
        process.exit(1);
    }); 
    
}


