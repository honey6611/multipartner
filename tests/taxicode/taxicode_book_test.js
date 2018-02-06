var chai = require('chai');
var expect = chai.expect;// we are using the "expect" style of Chai
var assert = chai.assert
var conn = require("../../config/databaseConnection");
var TaxiCodebooking = require('../../taxicode/booking') ;

//var str="sessionid=112323&AgentID=60042&CodeFrom=ALC&CodeTo=BEN&Adults=2&Children=0&Infants=0&FromDate=20180415&ToDate=20180428&FromTime=1400&ToTime=1200&FromLat=51.4703&FromLong=-0.45342&ToLat=50.8197675&ToLong=-1.0879769000000579&currencyid=GBP"
let str={
    'quot-e':'40437EF87475F9AE2A238B16EA1130FF',
    'vehicle':'2',
    'test':'1',
    'name':'Chathura fernando',
    'email':'chathura@a2btransfers.com',
    'telephone':'11223344556',
    'method':'authorised_payment_handler'    
}
describe('TaxiCode Booking',function(){
    it('Taxicode booking should return an object', function(done){
        this.timeout(4000);
        TaxiCodebooking(str,function(err,ret){
            console.log(typeof(ret))
            // assert.notEqual(ret, undefined);
            // assert.notEqual(ret, null);
            assert.isObject(ret)
            done();
        });   

    })
})

