const sql = require('mssql');
var sqlConn = sql.globalConnection;
//const config = require('./config/databaseConnection') ;
// const pool = sql.connect(config)

module.exports = async (sessionid,restme,cb) => {
   //try{sql.close(); }                    
   //catch(err){consloke.log("connection close error :" + err)}    
   try {
       var request = new sql.Request(sqlConn);
       //const pool = await sql.connect(config)
       const result = await sql.query `select numrest= count(id) from APISearchData where sessionid=${sessionid}`
       updatetable(restme,result.recordset[0].numrest,sessionid)
       //console.log(`select numrest= count(id) from APISearchData where sessionid=${sessionid}`);
       cb(null, result.recordset[0].numrest);
   } catch (err) {
       // ... error checks
       cb(err,null);
   }
};

async function updatetable(restme,numrest,sesid){
    var request = new sql.Request(sqlConn);
    //console.log(`update APISearchDataMaster set Resptime=${restme},NumResults=${numrest} where sessionid=${sesid}`)
    const result2 = await sql.query `update APISearchDataMaster set Resptime=${restme},NumResults=${numrest} where sessionid=${sesid}`
   
}