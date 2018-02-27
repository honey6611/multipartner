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
  var Booking = require('../app/taxicode/booking')

router.get('/',[
    check('Quote', 'Quote cannot be empty and must be atleast 10 characters long').isLength({ min: 10 }).isAlphanumeric(),
    check('Vehicle', 'Vehicle cannot be empty and must be atleast 1 characters long').isLength({ min: 1 }).isNumeric(),
    check('Name', 'Name cannot be empty and must be atleast 4 characters long').isLength({ min: 4 }).isAlphanumeric(),
    check('Email', 'Email is either empty or invalid').isEmail()
    
],  (req, res, next)=> {
    booking(req,(err,response)=>{
        //console.log(response)
    })
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end("Get method for Book not implemented")
})

router.post('/', [], (req, res, next)=> {
    check('Quote', 'Quote cannot be empty and must be atleast 10 characters long').isLength({ min: 10 }).isAlphanumeric(),
    check('Vehicle', 'Vehicle cannot be empty and must be atleast 1 characters long').isLength({ min: 1 }).isNumeric(),
    check('Name', 'Name cannot be empty and must be atleast 4 characters long').isLength({ min: 4 }).isAlphanumeric(),
    check('Email', 'Email is either empty or invalid').isEmail()

    booking(req,(err,response)=>{
        //console.log(response)
    })
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end("Post method for booking not implemented")
})    

module.exports = router