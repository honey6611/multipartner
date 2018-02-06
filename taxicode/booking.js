let https = require('https');
let querystring = require('querystring');
let setting = require('../config/settings.json');
let moment = require('moment');
var CreateLogs = require('../lib/CreateLogs')
module.exports = function booking(data, callback){
        var tc_apiKey       = "WIbKkK6MWjbGFjmy"
        var tc_secretKey    = "ac6G7isG0R98SeyE"   
        var tf = moment();         
        var tc_DataToSend = `quote=${data.quote}&vehicle=${data.vehicle}&test=1&name=${data.name}&email=${data.email}&telephone=${data.telephone}&key=${tc_apiKey}&method=authorised_payment_handler`      

        var options = {
            host: 'api.taxicode.com',
            port: 443,
            timeout: 4000,
            method: 'POST',
            path: '/booking/pay/?format=json',
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
                //dbase(result,data.sessionid,transferFlag,function(err,stat){
                    //console.log(JSON.stringify(result))
                    tt=moment();
                    console.log("Taxi Code End : " + tt.diff(tf,'milliseconds',true) )
                    //loging code
                    if(data.log_info != undefined){
                        var testObj={"SessionId":data.sessionid,"PartnerName": "TaxiCode","Category": "Info","SubCategory": "Processing time","Body": "Process completed in : " +  tt.diff(tf,'milliseconds',true) + " sec"}
                        CreateLogs(testObj,function(err,str){if(err)  console.log("error on logging")});     
                    }
                    //end of logging
                    return callback(null,JSON.parse(result));     // Return Control to async
                    //return;
                //}); // INSERT INTO DATABASE

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
            res.destroy();
            this.abort();
            console.error("Error from here:" +err);
            //loging code
            var testObj={"SessionId":data.sessionid,"PartnerName": "TaxiCode","Category": "Error","SubCategory": "HTTP ERROR","Body": "req.on Error " +err}
            CreateLogs(testObj,function(err,str){if(err)  console.log("error on logging")});              
            //end of logging
            return callback('Error ' + err,null);
        });

        req.setTimeout(setting.timeout, function(){ // 3 SECONDS ID THE TIMEOUT PERIOD
            res.destroy();
            req.abort();
            //loging code
            var testObj={"SessionId":data.sessionid,"PartnerName": "TaxiCode","Category": "Error","SubCategory": "Time Out","Body": "Max response time exceeded"}
            CreateLogs(testObj,function(err,str){if(err)  console.log("error on logging")});                        
            //end of logging
            return  callback('Timeout',null);
        });        
        //send request witht the postData form
        req.write(tc_DataToSend);
        req.end();
}



