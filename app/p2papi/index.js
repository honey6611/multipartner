const sql = require('mssql')
var moment = require('moment');
var setting = require('../../config');
var sqlConn = sql.globalConnection;
    module.exports = async function p2p(data,callback) {
        //console.log("P2P code Fired :" + moment() )
        //console.log("adults :" +data.Adults)
      try {
        if (data.ToDate=='' || data.ToDate==undefined){
            ToDate='';
            ToTime='';
            transferFlag=1
        }
        else{
            ToDate=data.ToDate;
            ToTime=data.ToTime;
            transferFlag=3
        }

        KMDistance =(data.KMDistance=='' || data.KMDistance==undefined) ? null : data.KMDistance;
		
        var request = new sql.Request(sqlConn);
        const result = await sql.query `exec ${setting.provider.p2p.sp_name}
        @SessionID=${data.sessionid},
        @arrivaldate=${data.FromDate},
        @departuredate=${ToDate},
        @Lang='EN',
        @CodeFrom=${data.CodeFrom},    
        @CodeTo=${data.CodeTo},    
        @Adults=${data.Adults},    
        @Children=${data.Children},    
        @Infants=${data.Infants},    
        @AgentID=${data.AgentID},
        @UnitID=0,    
        @PriceID=0,
        @ArrTime=${data.FromTime},
        @RetTime=${ToTime},
		@KMDistance=${KMDistance},
        @TransferType=0,
		@Lat1=${data.FromLat},
		@Long1=${data.FromLong},
		@Lat2=${data.ToLat},
		@Long2=${data.ToLong},
		@IsReturn=${data.IsReturn}`
        sql.on('error', err => {
            // error handler ....
            console.error("P2P SQL err :"+err)
            return;
        })

        callback(null,result);    
        //sql.close;   
        //if (pool) pool.close();  

        
      } catch (err) {
          // ... error checks
          console.error('P2p Store proc error : '+err);
          return;
      }
      finally{
        console.log( "P2P End"+ Date.now()); 
        return;
      }
  }
 
  //sql.on('error', err => {
      // ... error handler
  //    console.log(err);
  //})

/*}*/


