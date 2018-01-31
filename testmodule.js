// Include the async package
// Make sure you add "async" to your package.json
var async = require("async");
var http = require('http');
var fs = require('fs');
function AsyncCall(printthis){
    //With Array
    var stack = [];
    var calls=0;

    var functionOne = function(callback) { 
        calls=calls+1
        console.log("called >>" + calls)
        var data ="calls="+calls+"&sessionid=99999&AgentID=60042&CodeFrom=ALC&CodeTo=BEN&Adults=2&Child=0&Infant=0&FromDate=20180415&ToDate=20180428&FromTime=1400&ToTime=1200&FromLat=51.4703&FromLong=-0.45342&ToLat=50.8197675&ToLong=-1.0879769000000579&currencyid=GBP"
        var options = {
            host: 'localhost',
            port: 2000,
            method: 'POST',
            path: '/post',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': data.length
            }
          };
           
          // request object
          var req = http.request(options, function (res) {
            var result = '';
            res.on('data', function (chunk) {
              result += chunk;
            });
            res.on('end', function () {
              console.log(result)  
              printthis(result);
            });
            res.on('error', function (err) {
              console.log(err);
            })
          });
           
          // req error
          req.on('error', function (err) {
            console.log(err);
          });
           
          //send request witht the postData form
          req.write(data);
          req.end();       
    }


    for (var i=0;i<1;i++){
    stack.push(functionOne);  
    };  
    //functionOne();
    //functionOne();
    
            
    async.parallel(stack, function(err, result) {  
         //console.log('Async parallel with array', result);
         printthis(result)
    }); 


}

AsyncCall(function(data){
  console.log("from call:" + data)
  //var somedata =  "api: "+data  ;
  fs.appendFile("C:\\node\\sql\\test.txt", data, function(err) {
      if(err) {
          return console.log(err);
      }
  
      console.log("The file was saved!");
  }); 
})



//functionOne('adasds',function(d){
    //console.log(d)
//})