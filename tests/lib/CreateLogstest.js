var chai = require('chai');
var expect = chai.expect;// we are using the "expect" style of Chai
var assert = chai.assert
var CreateLogs = require('../../lib/CreateLogs') ;


describe('Insert-Logs',function(){
    it('Insert log should return a string',async function(){
        var testObj={
            "PartnerName": "Mozio",
            "Category": "Request Error",
            "Category": "Sub Error",
            "Body": "server time out"
        }
        this.timeout(5000);
        CreateLogs(testObj,function(err,str){
            assert.isNotNull(str);
            //done();
        });
    })
})
