let https = require('https');
let querystring = require('querystring');
let _ = require('lodash');
let dbase =  require('./dbase');
var moment = require('moment');
var setting = require('../../config');
var searchPoll = require('./MozioPoll').SearchPoll ;

//var xml2js = require('xml2js');
//http://localhost:5000/?id=123&Adults=2&Child=0&Infant=0&FromDate=20171215&ToDate=20171230&FromTime=1200&ToTime=1200&FromLatLong=51.4703,-0.45342&ToLatLong=50.8197675,%20-1.0879769000000579
module.exports = function getdata(data,callback){

    var tf = moment();    
    console.log("Mozio code Fired :" + tf )
    var tt=moment();  
        var ToDate, People=0
        var CurID = (data.currencyid==='' || data.currencyid===undefined ? 'GBP' : data.currencyid)
        var SearchID

        // Calculate People
        People= data.Adults==''||data.Adults==undefined ? parseInt(People)+0 : parseInt(People)+parseInt(data.Adults);
        People= data.Children==''||data.Children==undefined ? People=(parseInt(People)+0) : People=parseInt(People)+parseInt(data.Children);
        People= data.Infants==''||data.Infants==undefined ? People=(parseInt(People)+0) : People=parseInt(People)+parseInt(data.Infants);
        // End of calculate people

        //From Date Calculation
        if (data.FromDate3rd=='' || data.FromDate3rd==undefined){FromDate=''}
        else{FromDate=data.FromDate3rd; FromDate= data.FromDate3rd.substring(0, 4)+'-'+data.FromDate3rd.substring(4, 6)+'-'+data.FromDate3rd.substring(6, 8)}
        // End of From Date 

        //To Date Calculation
        if (data.ToDate3rd=='' || data.ToDate3rd==undefined){ToDate=''}
        else{ToDate=data.ToDate3rd; ToDate= data.ToDate3rd.substring(0, 4)+'-'+data.ToDate3rd.substring(4, 6)+'-'+data.ToDate3rd.substring(6, 8)}
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

        FromDate=FromDate +'T'+FromTime
        ToDate = ToDate!=='' || ToDate!==undefined ? ToDate=ToDate+'T'+ToTime : ''
        
        var  transferFlag, mode;

        if (ToDate==='' || ToDate===undefined)
          {
            transferFlag=1;
            mode="one_way"
          }
        else
          {
            transferFlag=3;
            mode="round_trip"
          }

          var sendData ={};
          sendData.start_lat=data.FromLat;
          sendData.start_lng=data.FromLong;
          sendData.end_lat=data.ToLat;
          sendData.end_lng=data.ToLong;
          sendData.mode=mode;
          sendData.pickup_datetime=FromDate;
          if(ToDate!=undefined && ToDate!=""){
            sendData.return_pickup_datetime=ToDate;
          }
          sendData.num_passengers=People;
          sendData.currency=CurID;
          
         var tc_DataToSend=querystring.stringify(sendData)
        //console.log (tc_DataToSend)
        // request option
        var options = {
          host: setting.provider.mozio.host,
          port: 443,
          method: 'POST',
          path: '/v2/search/',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(tc_DataToSend),
            'API-KEY':setting.provider.mozio.api_key
          }
        };
        
        // request object
        var req = https.request(options, function (res) {
          var result = '';
          var mozresult =''
          var interval;
          res.on('data', function (chunk) {
            result += chunk;
          });
          res.on('end', function () {
                var boolCallbackCalled = false;

                var arg2 = (MozioReturnData)=>{ // ARG 2 FUNCTION
                    try{
                        mozresult=mozresult.concat(JSON.parse(MozioReturnData))
                        var mozresultJason = JSON.parse(MozioReturnData);
                        console.log("milli sec passed : " + tt.diff(tf,'milliseconds',true) )
                        if ((mozresultJason.more_coming==false ||   tt.diff(tf,'milliseconds',true) >= setting.timeout || mozresultJason.non_field_errors!= undefined) && !boolCallbackCalled){
                          try{
                              //callback(null,'More comming : '+ mozresult);
                              dbase(MozioReturnData,
                                data.sessionid,
                                transferFlag,
                                (err,stat)=>{
                              }); // INSERT INTO DATABASE                        
                              clearInterval(interval);
                              boolCallbackCalled=true;
                              console.info('More comming : '+ mozresultJason.more_coming)
                              return callback('More comming : '+ mozresult); 
                          }
                          catch(err){
                            console.error("Mozio Error 1" + err)
                            return;
                          }
                        }  
                        else{
                          console.log("Mozio cALLING db")
                          tt=moment();
                            dbase(MozioReturnData,
                              data.sessionid,
                              transferFlag,
                              (err,stat)=>{
                                // THIS BLOCK TO CALL ONLY ONCE
                                if(data.ResponseType!=='1'){
                                  callback(null,'More comming : '+ mozresult);
                                }
                            }); // INSERT INTO DATABASE
                            return;
                        }                    
                    }
                    catch(err){
                      console.error("Json error :" + MozioReturnData )
                      callback("Json error :" + MozioReturnData ,null);
                      return;
                    }
                }

                try{ // Check if JSON is valid
                    var arg1 = JSON.parse(result).search_id;
                    if(arg1==undefined && JSON.parse(result).code!=='throttled'){// if no searchid then ignore and return
                      console.log("Mozio :No result" + JSON.stringify(result));
                      callback('Mozio noresult : '+ result,result);
                      return;
                    }
                    else{
                      if(data.ResponseType=='1'){
                        interval = setInterval( // Polling
                          ()=>{return searchPoll(arg1,arg2)}, 
                          2500
                        );
                      }
                      else{
                        interval = setTimeout( // Just 1 call
                          ()=>{return searchPoll(arg1,arg2)}, 
                          2000
                        );
                      }  
   
                    }                 
                  } 
                catch(err){
                  
                  console.log("Jason error :" + result , result)
                  return callback(null,'Mozio invalid Json object : '+ result)
                }                


          });
          res.on('error', (err)=> {
            console.log(err);
          })
        });
        
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


