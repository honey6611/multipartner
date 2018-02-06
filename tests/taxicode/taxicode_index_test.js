var chai = require('chai');
var expect = chai.expect;// we are using the "expect" style of Chai
var assert = chai.assert
var conn = require("../../config/databaseConnection");
var TaxiCode = require('../../taxicode/index') ;

//var str="sessionid=112323&AgentID=60042&CodeFrom=ALC&CodeTo=BEN&Adults=2&Children=0&Infants=0&FromDate=20180415&ToDate=20180428&FromTime=1400&ToTime=1200&FromLat=51.4703&FromLong=-0.45342&ToLat=50.8197675&ToLong=-1.0879769000000579&currencyid=GBP"
let str={
    'sessionid':'112323',
    'AgentID':'60042',
    'CodeFrom':'ALC',
    'CodeTo':'BEN',
    'Adults':'2',
    'Children':'0',
    'Infants':'0',
    'FromDate':'20180415',
    'ToDate':'20180428',
    'FromTime':'1400',
    'ToTime':'1200',
    'FromLat':'51.4703',
    'FromLong':'-0.45342',
    'ToLat':'50.8197675',
    'ToLong':'-1.0879769000000579',
    'currencyid':'GBP'    
}
describe('TaxiCode',function(){
    it('Taxicode should return an object', function(done){
        this.timeout(4000);
        TaxiCode(str,function(err,ret){
            console.log(typeof(ret))
            // assert.notEqual(ret, undefined);
            // assert.notEqual(ret, null);
            assert.isObject(ret)
            done();
        });   

    })
})

