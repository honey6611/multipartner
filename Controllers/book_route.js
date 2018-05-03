var express = require('express')
  , router = express.Router()

  var js2xmlparser = require("js2xmlparser");  
  var moment = require('moment');
  let _ = require('lodash');

  const { check, validationResult } = require('express-validator/check');
  const { matchedData, sanitize } = require('express-validator/filter');
  var js2xmlparser = require("js2xmlparser");  

  var async = require('../async')
  var CreateLogs = require('../lib/CreateLogs')
  var Taxicode_Booking = require('../app/taxicode/booking');//631
  var Mozio_Booking = require('../app/mozio/booking'); //873
  var setting = require('../config');
  var GetSearchIdDetails = require('../lib/GetSearchIdDetails');
  router.use(GetSearchIdDetails());
// Expected payload
/*
    PartnerId
    APISearchData_ID
    FirstName
    LastName
    Email
    Phone
    CountryCode

    -- optional --
    Journey1_Airline
    Journey1_FlightNumber
    Journey2_Airline
    Journey2_FlightNumber
    Notes
*/
router.get('/',[
    check('PartnerId', 'PartnerId cannot be empty').isLength({ min: 2 }).isNumeric(),
    check('APISearchData_ID', 'APISearchData_ID cannot be empty and must be atleast 1 characters long').isLength({ min: 1 }).isNumeric(),
    check('FirstName', 'FirstName cannot be empty and must be atleast 4 characters long').isLength({ min: 4 }).isAlphanumeric(),
    check('LastName', 'LastName cannot be empty and must be atleast 4 characters long').isLength({ min: 4 }).isAlphanumeric(),
    check('Email', 'Email is either empty or invalid').isEmail(),
    check('Phone', 'Phone is either empty or invalid').isLength({ min: 6 }).isNumeric(),
    check('CountryCode', 'CountryCode cannot be empty').isLength({ min: 2 }).isAlphanumeric()
    
],  (req, res, next)=> {
    req.query.log_info=1; // set this to create logs  
    var PartnerId = req.query.PartnerId
    switch(PartnerId){
        case setting.provider.taxicode.id :{//Taxicode
            //console.log(req.body.searchData)
            Taxicode_Booking(req.query,(err,response)=>{
                res.setHeader('Content-Type', 'text/xml');
                if(err){
                   SendResponse(res,0,'',err.APIBookingDataID)
                }
                else{
                   SendResponse(res,1,response.returnpayload.reference,response.APIBookingDataID)
                }
           })
            break;    
        }
        case setting.provider.mozio.id :{//Mozio
            Mozio_Booking(req.query,(err,response)=>{
                //console.log(response)
            })
            break;    
        }        
    }

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end("Get method for Book not implemented")
})

router.post('/', [
    check('PartnerId', 'PartnerId cannot be empty').isLength({ min: 2 }).isAlphanumeric(),
    check('APISearchData_ID', 'APISearchData_ID cannot be empty and must be atleast 1 characters long').isLength({ min: 1 }).isNumeric(),
    check('FirstName', 'FirstName cannot be empty and must be atleast 4 characters long').isLength({ min: 4 }).isAlphanumeric(),
    check('LastName', 'LastName cannot be empty and must be atleast 4 characters long').isLength({ min: 4 }).isAlphanumeric(),
    check('Email', 'Email is either empty or invalid').isEmail(),
    check('Phone', 'Phone is either empty or invalid').isLength({ min: 6 }).isNumeric(),
    check('CountryCode', 'CountryCode cannot be empty').isLength({ min: 2 }).isAlphanumeric()
], (req, res, next)=> {
    req.body.log_info=1; // set this to create logs  
    var PartnerId = parseInt(req.body.PartnerId)
    console.log(PartnerId);
    //console.log(typeof setting.provider.taxicode.id);
    switch(PartnerId){
        case setting.provider.taxicode.id :{//Taxicode
            //console.log(req.body.searchData)
            Taxicode_Booking(req.body,(err,response)=>{
                 res.setHeader('Content-Type', 'text/xml');
                 if(err){
                    SendResponse(res,0,'',err.APIBookingDataID)
                 }
                 else{
                    SendResponse(res,1,response.returnpayload.reference,response.APIBookingDataID)
                 }
            })
            break;    
        }
        case setting.provider.mozio.id :{//Mozio
            Mozio_Booking(req.body,(err,response)=>{
                res.setHeader('Content-Type', 'text/xml');
                if(err){
                   SendResponse(res,0,'',err.APIBookingDataID)
                }
                else{
                   SendResponse(res,1,response.bookingRef,response.APIBookingDataID)
                }
            })
            break;    
        }        
    }
    //res.writeHead(200, {'Content-Type': 'text/html'});
    //res.end("Post method for booking not implemented")
})    


function SendResponse(resp,Status,BookingRef,APIBookingDataID){
    resp.setHeader('Content-Type', 'text/xml');
    resp.end(`<?xml version='1.0' encoding='UTF-8'?><TCOML>
    <StatusCode>${Status}</StatusCode>
    <BookingRef>${BookingRef}</BookingRef>
    <APIBookingDataID>${APIBookingDataID}</APIBookingDataID>
    </TCOML>`)    
}
module.exports = router