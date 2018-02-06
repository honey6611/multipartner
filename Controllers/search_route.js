var express = require('express')
  , router = express.Router()


var moment = require('moment');
let _ = require('lodash');

const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
var js2xmlparser = require("js2xmlparser");  

  
var async = require('../async')
var CreateLogs = require('../lib/CreateLogs')

let js2xmlparser_options = {
    declaration: {
        encoding: "UTF-8",
        version: "1.0"
    }
}
router.get('/',[
    check('AgentID', 'AgentID cannot be empty and must be atleast 4 characters long').isLength({ min: 4 }).isNumeric(),
    check('sessionid', 'sessionid cannot be empty and must be atleast 4 characters long').isLength({ min: 4 }),
    check('CodeFrom', 'CodeFrom cannot be empty and must be 3 characters long').isLength({ min: 3, max: 3 }),
    check('CodeTo', 'CodeTo cannot be empty and must be 3 characters long').isLength({ min: 3, max: 3 }),
    check('Adults', 'Adults cannot be empty and needs to be between 0 - 50').isLength({ min: 1, max: 50 }).isNumeric(),
    check('Children', 'Children minimum value 1 and max 50').optional({ checkFalsy: true }).isInt(),
    check('Infant', 'Infants minimum value 1 and max 50').optional({ checkFalsy: true }).isInt(),        
    check('FromLat', 'FromLat is invalid or empty').isLength({ min: 1, max: 50 }).isFloat(),
    check('FromLong', 'FromLong is invalid or empty').isLength({ min: 1, max: 50 }).isFloat(),
    check('ToLat', 'ToLat is invalid or empty').isLength({ min: 1, max: 50 }).isFloat(),
    check('ToLong', 'ToLong is invalid or empty').isLength({ min: 1, max: 50 }).isFloat(),
    check('FromDate', 'FromDate is invalid or empty').isLength({ min: 8, max: 8 }).isDecimal(),
    check('ToDate', 'ToDate is invalid or empty').optional({ checkFalsy: true }).isLength({ min: 8, max: 8 }).isDecimal(),        
    check('FromTime', 'FromTime is invalid or empty HHMM').isLength({ min: 4, max: 4 }).isDecimal(),   
    check('ToTime', 'ToTime is invalid or empty HHMM').optional({ checkFalsy: true }).isLength({ min: 4, max: 4 }).isDecimal(),   
    check('currencyid', 'currencyid is invalid or empty').isLength({ min: 3, max: 3 }).isAlpha()           
],  (req, res, next) => {
    
    res.setHeader('Content-Type', 'text/xml');
        // normal processing here
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.end(js2xmlparser.parse("Errors", errors.mapped(),js2xmlparser_options));
            var testObj={
                "SessionId":req.query.sessionid,
                "PartnerName": "ALL",
                "Category": "Error",
                "Category": "Required parameters missing or invalid",
                "Body": js2xmlparser.parse("Errors", errors.mapped(),js2xmlparser_options)
            }
            CreateLogs(testObj,(err,str)=>{
                // loggin error
                if(err)  console.log("error on logging")
            });
        }
        else{
            var tf = moment();
            prams = req.query;
            async(prams,(data)=>{
                tt=moment();
                var output =  tt.diff(tf,'seconds',true);
                console.log("Process completed in : " + output + " sec")
                if(req.body.log_info != undefined){
                    var testObj={"SessionId":req.body.sessionid,"PartnerName": "ALL","Category": "Info","SubCategory": "Overall processing Time","Body": "Process completed in : " + output + " sec"}
                    CreateLogs(testObj,function(err,str){if(err)  console.log("error on logging")});     
                }
                res.end(`<?xml version='1.0' encoding='UTF-8'?><TCOM>
                <ResponseTime>${output}</ResponseTime>
                <result>
                    <sessionid>${req.query.sessionid}</sessionid>
                </result></TCOM>`)
            }) 
        }           
})

router.post('/',[
    check('AgentID', 'AgentID cannot be empty and must be atleast 4 characters long').isLength({ min: 4 }).isNumeric(),
    check('sessionid', 'sessionid cannot be empty and must be atleast 4 characters long').isLength({ min: 4 }),
    check('CodeFrom', 'CodeFrom cannot be empty and must be 3 characters long').isLength({ min: 3, max: 3 }),
    check('CodeTo', 'CodeTo cannot be empty and must be 3 characters long').isLength({ min: 3, max: 3 }),
    check('Adults', 'Adults cannot be empty and needs to be between 0 - 50').isLength({ min: 1, max: 50 }).isNumeric(),
    check('Children', 'Children minimum value 1 and max 50').optional({ checkFalsy: true }).isInt(),
    check('Infants', 'Infants minimum value 1 and max 50').optional({ checkFalsy: true }).isInt(),        
    check('FromLat', 'FromLat is invalid or empty').isLength({ min: 1, max: 50 }).isFloat(),
    check('FromLong', 'FromLong is invalid or empty').isLength({ min: 1, max: 50 }).isFloat(),
    check('ToLat', 'ToLat is invalid or empty').isLength({ min: 1, max: 50 }).isFloat(),
    check('ToLong', 'ToLong is invalid or empty').isLength({ min: 1, max: 50 }).isFloat(),
    check('FromDate', 'FromDate is invalid or empty').isLength({ min: 8, max: 8 }).isDecimal(),
    check('ToDate', 'ToDate is invalid or empty').optional({ checkFalsy: true }).isLength({ min: 8, max: 8 }).isDecimal(),        
    check('FromTime', 'FromTime is invalid or empty HHMM').isLength({ min: 4, max: 4 }).isDecimal(),   
    check('ToTime', 'ToTime is invalid or empty HHMM').optional({ checkFalsy: true }).isLength({ min: 4, max: 4 }).isDecimal(),   
    check('currencyid', 'currencyid is invalid or empty').isLength({ min: 3, max: 3 }).isAlpha()           
], function (req, res) {
        res.setHeader('Content-Type', 'text/xml');
        // normal processing here
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.end(js2xmlparser.parse("Errors", errors.mapped(),js2xmlparser_options));
            var testObj={"SessionId":req.body.sessionid,"PartnerName": "ALL","Category": "Error","SubCategory": "Required parameters missing or invalid","Body": js2xmlparser.parse("Errors", errors.mapped(),js2xmlparser_options)}
            CreateLogs(testObj,function(err,str){if(err)  console.log("error on logging")});                
        }
        else{            
           var tf = moment();
           prams = req.body;
            async(prams,function(data){
                tt=moment();
                var output =  tt.diff(tf,'seconds',true);
                console.log(" Process completed in : " + output + " sec")
                if(req.body.log_info != undefined){
                    var testObj={"SessionId":req.body.sessionid,"PartnerName": "ALL","Category": "Info","SubCategory": "Overall Processing time","Body": "Process completed in : " + output + " sec"}
                    CreateLogs(testObj,function(err,str){if(err)  console.log("error on logging")});     
                }
                res.end(`<?xml version='1.0' encoding='UTF-8'?><TCOM>
                <ResponseTime>${output}</ResponseTime>
                <result>
                    <sessionid>${req.body.sessionid}</sessionid>
                </result></TCOM>`)
            })
        }    
})

module.exports = router