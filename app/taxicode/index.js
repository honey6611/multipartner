let https = require('https');
let querystring = require('querystring');
let _ = require('lodash');
var moment = require('moment');
let dbase =  require('./dbase');
var setting = require('../../config');
var CreateLogs = require('../../lib/CreateLogs')
//http://localhost:5000/?id=123&Adults=2&Child=0&Infant=0&FromDate=20171215&ToDate=20171230&FromTime=1200&ToTime=1200&FromLatLong=51.4703,-0.45342&ToLatLong=50.8197675,%20-1.0879769000000579
module.exports = function getdata(data,callback){
    var tc_apiKey       = setting.provider.taxicode.api_key; 
    var tc_secretKey    = setting.provider.taxicode.secret_key ;
    var tf = moment();    
    console.log("taxi code Fired :" + tf )
    var tt=moment();
        var ToDate, People=0
        var FromLatLong,ToLatLong
        FromLatLong =data.FromLat+","+data.FromLong
        ToLatLong =data.ToLat+","+data.ToLong

        // Calculate People
        if (data.Adults==''||data.Adults==undefined){People=(parseInt(People)+0)}
        else{People=parseInt(People)+parseInt(data.Adults)}
        if (data.Children==''||data.Children==undefined){People=(parseInt(People)+0)}
        else{People=parseInt(People)+parseInt(data.Children)}
        if (data.Infants==''||data.Infants==undefined){People=(parseInt(People)+0)}
        else{People=parseInt(People)+parseInt(data.Infants)}        
        // End of calculate people

        //From Date Calculation
        if (data.FromDate3rd=='' || data.FromDate3rd==undefined){FromDate=''}
        else{FromDate=data.FromDate3rd; FromDate= data.FromDate3rd.substring(0, 4)+'/'+data.FromDate3rd.substring(4, 6)+'/'+data.FromDate3rd.substring(6, 8)}
        // End of From Date 

        //To Date Calculation
        if (data.ToDate3rd=='' || data.ToDate3rd==undefined){ToDate=''}
        else{ToDate=data.ToDate3rd; ToDate= data.ToDate3rd.substring(0, 4)+'/'+data.ToDate3rd.substring(4, 6)+'/'+data.ToDate3rd.substring(6, 8)}
        // End of todate 

        //From Time Calculation
        if (data.FromTime3rd=='' || data.FromTime3rd==undefined){FromTime=''}
        else{FromTime=data.FromTime3rd; FromTime= data.FromTime3rd.substring(0, 2)+':'+data.FromTime3rd.slice(-2);}
        // End of FromTime    

        //To Time Calculation
        var ToTime="";
        if (data.ToTime3rd=='' || data.ToTime3rd==undefined){ToTime=''}
        else{ToTime=data.ToTime3rd; ToTime= data.ToTime3rd.substring(0, 2) +':'+ data.ToTime3rd.slice(-2);}

        // End of ToTime    

        FromDate=FromDate +' '+FromTime
        //FromDate="2017/10/12"
        FromDate = new Date(FromDate)
        //console.log("GetTime :" +FromDate)
        FromDate = FromDate.getTime()/1000|0
        
        if (ToDate!=='' || ToDate!==undefined)
        {
          ToDate=ToDate+' '+ToTime;
          ToDate = new Date(ToDate);
          ToDate = ToDate.getTime()/1000|0;
        }
        
        var  transferFlag;
        if (ToDate==='' || ToDate===undefined){transferFlag=1}
        else{transferFlag=3}

        var tc_DataToSend = `pickup=${FromLatLong}&destination=${ToLatLong}&date=${FromDate}&return=${ToDate}&people=${People}&key=${tc_apiKey}`      

        var options = {
          host: setting.provider.taxicode.host,
          port: 443,
          timeout: 4000,
          method: 'POST',
          path: '/booking/quote/?format=json',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': tc_DataToSend.length
          }
        };
        
        // request object
        var req = https.request(options, function (res) {
          var result = '';
          res.on('data', function (chunk) {
            result += chunk;
          });
          res.on('end', function () {
            if(JSON.parse(result).status=='OK'){
              //callback(JSON.parse(result).quotes);     // Return Control to async
              dbase(result,data.sessionid,transferFlag,function(err,stat){
                  tt=moment();
                  console.log("Taxi Code End : " + tt.diff(tf,'milliseconds',true) )
                  //loging code
                  if(data.log_info != undefined){
                    var testObj={"SessionId":data.sessionid,"PartnerName": "TaxiCode","Category": "Info","SubCategory": "Processing time","Body": "Process completed in : " +  tt.diff(tf,'milliseconds',true) + " sec"}
                    CreateLogs(testObj,function(err,str){if(err)  console.log("error on logging")});     
                  }
                  //end of logging
                  return callback(null,JSON.parse(result).quotes);     // Return Control to async
                  //return;
              }); // INSERT INTO DATABASE

            }
            else{
              console.info( "TaxiCode Error Response :"+ JSON.stringify(result))
              //loging code
              var testObj={"SessionId":data.sessionid,"PartnerName": "TaxiCode","Category": "Error","SubCategory": "HTTP ERROR","Body": JSON.stringify(result)}
              CreateLogs(testObj,function(err,str){if(err)  console.log("error on logging")});                  
              //end of logging
              return callback ('Error: '+JSON.parse(result), null)
            }
          });
        });
        
        // req error
        req.on('error', function (err) {
          req.destroy();
          this.abort();
          console.error("Error from here:" +err);
          //loging code
          var testObj={"SessionId":data.sessionid,"PartnerName": "TaxiCode","Category": "Error","SubCategory": "HTTP ERROR","Body": "req.on Error " +err}
          CreateLogs(testObj,function(err,str){if(err)  console.log("error on logging")});              
          //end of logging
          try{
            return callback('Error ' + err,null);
          }
          catch(err){
            return;  
          }
        });

        req.setTimeout(setting.timeout, function(){ // 3 SECONDS ID THE TIMEOUT PERIOD
          req.destroy();
          req.abort();
          //loging code
          var testObj={"SessionId":data.sessionid,"PartnerName": "TaxiCode","Category": "Error","SubCategory": "Time Out","Body": "Max response time exceeded"}
          CreateLogs(testObj,function(err,str){if(err)  console.log("error on logging")});                        
          //end of logging
          try{
            return  callback('Timeout',null);
          }
          catch(err)  {
            return;
          }
          
        });        
        //send request witht the postData form
        req.write(tc_DataToSend);
        req.end();
}


