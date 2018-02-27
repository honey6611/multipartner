let https = require('https');
let querystring = require('querystring');
let setting = require('../../config/settings.json');
let moment = require('moment');
var CreateLogs = require('../../lib/CreateLogs')
module.exports = function booking(data, callback){

    var tc_DataToSend=querystring.stringify({
        "search_id": data.search_id,
        "result_id": data.result_id,
        "email": data.email,
        "country_code_name": data.country_code_name,
        "phone_number": data.phone_number,
        "first_name": data.first_name,
        "last_name": data.last_name,
        "airline": data.airline,
        "flight_number": data.flight_number,
        "customer_special_instructions": data.customer_special_instructions
                  
      })


    var options = {
        host: 'api-testing.mozio.com',
        port: 443,
        method: 'GET',
        path: '/v2/reservations/',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(tc_DataToSend),
          'API-KEY':'947d9ddec286468cbb3593a857155838'
        }
      }; 
      
        // request object
        var req = https.request(options, function (res) {
            
            res.on('data', function (chunk) {
                result += chunk;
              });   

            res.on('end', function () { 

            }) 
            
            res.on('error', (err)=> {
                console.log(err);
              })            
        })  
        
        // req error
        req.on('error', (err)=> {
            console.log(`Mozio Error from here: ${err}`);
        });
  
        req.setTimeout(setting.timeout, ()=>{ // 3 SECONDS ID THE TIMEOUT PERIOD
            req.abort();
            callback('Timeout ', null);
        });        
          //send request witht the postData form
        req.write(tc_DataToSend);
        req.end();        
}