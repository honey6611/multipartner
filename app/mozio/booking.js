let https = require('https');
let querystring = require('querystring');
let setting = require('../../config/settings.json');
let moment = require('moment');
var CreateLogs = require('../../lib/CreateLogs');
var bookingPoll = require('./MozioPoll').BookPoll ;
const sql = require('mssql');
var sqlConn = sql.globalConnection;

module.exports = function booking(data, callback){
    var Quote,vehicle,FirstName,LastName,Email,Journey1_FlightNumber,Notes,CustomerName,Extras,status=0
    var BookingRef=[]
    FirstName=data.FirstName ;
    LastName=data.LastName ;
    Email=data.Email ;
    Phone=data.Phone ;
    Journey1_FlightNumber= (data.Journey1_FlightNumber=='' || data.Journey1_FlightNumber==undefined) ? '' : data.Journey1_FlightNumber ;
    Notes= (data.Notes=='' || data.Notes==undefined) ? '' : data.Notes;
    CustomerName= FirstName+' '+LastName  
    Extras =  (data.Extras=='' || data.Extras==undefined) ? '': data.Extras.split(",");

    var retObj={};
    var sendData ={};
    sendData.search_id= data.searchData.Company_SessionID
    sendData.phone_number= data.Phone		
    sendData.result_id= data.searchData.Company_Search_ResultId
    sendData.email= data.Email
    sendData.country_code_name= data.CountryCode
    sendData.first_name= data.FirstName
    sendData.last_name= data.LastName
    if(data.Journey1_Airline!=undefined && data.Journey1_Airline!=""){
      sendData.airline= data.Journey1_Airline			
    }
    if(data.Journey1_FlightNumber!=undefined && data.Journey1_FlightNumber!=""){
      sendData.flight_number= data.Journey1_FlightNumber
    }		
    if(data.Journey2_Airline!=undefined && data.Journey2_Airline!=""){
      sendData.return_airline= data.Journey2_Airline
    }
    if(data.Journey2_FlightNumber!=undefined && data.Journey2_FlightNumber!=""){
      sendData.return_flight_number= data.Journey2_FlightNumber
    }
    if(data.Notes!=undefined && data.Notes!=""){        
      sendData.customer_special_instructions= data.Notes
    }	
    if(data.Extras!=undefined && data.Extras!=""){   
      sendData.optional_amenities=Extras
    }
    if(data.bookingref!=undefined && data.bookingref!=""){
      sendData.partner_tracking_id=data.bookingref
    }


var tc_DataToSend=querystring.stringify(sendData)
      //console.log(tc_DataToSend)

    var options = {
        host: 'api-testing.mozio.com',
        port: 443,
        method: 'POST',
        path: '/v2/reservations/',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(tc_DataToSend),
          'API-KEY':'947d9ddec286468cbb3593a857155838'
        }
      }; 
      
        // request object
        var req = https.request(options, function (res) {
          var result = '';
          var interval;  
          var cnt=0    
            res.on('data', function (chunk) {
                result += chunk;
              });   

            res.on('end', function () { 
                console.log("Booking Result :" + result + '\n\n')
                // Create arguments for polling
                var arg1= data.searchData.Company_SessionID;
                var arg2= (mozResponse)=>{ // callback function
                  console.log("status " + JSON.parse(mozResponse).status)
                  //console.log("result " + mozResponse)
                  if( JSON.parse(mozResponse).status=="completed" || cnt>5 || JSON.parse(mozResponse).status==undefined){ // if not pending then cleaer interval
                    clearInterval(interval);
                    console.log("Cleared Interval :")
                    if(JSON.parse(mozResponse).reservations!=undefined){
                      status=1
                                JSON.parse(mozResponse).reservations.forEach(function (value) {
                        BookingRef.push(value.confirmation_number);
                      });					
                    }
                    let result1 = sql.query `insert into [APIBookingData] (BookingRef,BookingResponse,PartnerId,CustomerName,CustomerEmail,CustomerTelephone,Journey1_FlightNumber,Notes,status) 
                    values(${BookingRef.toString()},${JSON.stringify(mozResponse)},${data.PartnerId},${CustomerName},${Email},${Phone},${Journey1_FlightNumber},${Notes},${status})
                    ; select @@IDENTITY as 'Identity'`


                    retObj.bookingRef=BookingRef.toString();
                    result1.then((re)=>{
                        retObj.APIBookingDataID=re.recordset[0].Identity;
                        //console.log("return object " +retObj)
                        return callback (null, retObj);                    
                    }).catch((err)=>{
                        console.log(err)
                        retObj.APIBookingDataID='';
                        return callback (null, retObj)
                    })                                 
                  }
                  else{
                      cnt+=1
                      console.log('polling')
                      setTimeout( // then subsiguent calls with timer
                        ()=>{return bookingPoll(arg1,arg2)}, 
                        2000
                      );                                
                    }
                }

                // Now do polling
                interval = setTimeout( // then subsiguent calls with timer
                  ()=>{return bookingPoll(arg1,arg2)}, 
                  1000
                );                                

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