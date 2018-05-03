// Include the async package
// Make sure you add "async" to your package.json
var async = require("async");
var conn = require("./config/databaseConnection");
var TaxiCode  =  require("./app/taxicode/index");
var p2papi  =  require("./app/p2papi/index");
var Mozio  =  require("./app/mozio/index"); 
var CreateLogs = require('./lib/CreateLogs');
var settings = require('./config');
module.exports=function AsyncCall(request,FullData){
    //With Array
    //console.log("From Aync: " +request.id)
    var stack = [];
    var retval;
    var test;
    if(settings.provider.mozio.active===1 && request.Mozio!="-1"){
      // Mozio api
      var functionThree = function(callback) {  
        Mozio(request,function(data){
          callback(null, data);
        })
      }
      stack.push(functionThree); 
    }    
       
    if(settings.provider.taxicode.active===1 && request.TaxiCode!="-1"){
      // taxi code
      var functionOne = function(callback) { 
          TaxiCode(request,function(data){
          callback(null, data);
          })  
      }
      stack.push(functionOne); 
    }

    if(settings.provider.p2p.active===1 && request.P2P!="-1"){
      // P2P api
      var functionTwo = function(callback) {  
        p2papi(request,function(data){
          callback(null, data);
        })
      }
      stack.push(functionTwo);  
    }


    async.parallel(stack, function(err, result) {  
         //console.log('Async parallel with array', result);
         if(err){
           console.log("Async Error: " + err)
           var testObj={
            "SessionId":request.sessionid,
            "PartnerName": "ALL",
            "Category": "Error",
            "Category": "Error calling async parallel",
            "Body":err
            }
            CreateLogs(testObj,function(err,str){
                // loggin error
                if(err)  console.log("error on logging")
            });            
         }
         else{
           FullData(result)
          }
         
    }); 


}
