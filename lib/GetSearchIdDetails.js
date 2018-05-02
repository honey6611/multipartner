const sql = require('mssql')
var sqlConn = sql.globalConnection;

module.exports = function() {
    return function(req,res,next){
        var m_APISearchData_ID
        if(req.method =='POST')
            {m_APISearchData_ID=req.body.APISearchData_ID;}
        
        else
            {m_APISearchData_ID= req.query.APISearchData_ID ;}
        
        if(m_APISearchData_ID!=undefined && m_APISearchData_ID!=''){ 
            var request = new sql.Request(sqlConn);
            let result = sql.query`select top 1 * from APISearchData where id = ${m_APISearchData_ID}`
            result.then(rlt=>{
                //console.log(rlt);
                if(req.method =='POST'){req.body.searchData=rlt.recordset[0];}
                else{req.query.searchData=rlt.recordset[0];}
                next();
            })         

        }

      }
  }
