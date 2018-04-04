const sql = require('mssql')
var sqlConn = sql.globalConnection;
//const config = require('../config/databaseConnection')
let _ = require('lodash');
let moment = require('moment')
let querystring = require('querystring');
var fs = require('fs');

module.exports = async function insert(result,sessionid,tflag,callback){

    var company_name,company_logo,SearchTimeStamp
    var PriceID,Vehiclename,VehicleImage,passenger,luggage_big,luggage_small,NumUnits,id,vehicleclass,Transferflag,sessionid,OccupancyFrom
    var CurID,UnitID,Min_Stops,Max_Stops,Transferflag,company_sessionid,company_searchid
    var Luggage_Big,Luggage_Small,PartnerRating,PartnerReviewCount
    var json = JSON.parse(result); 
    var table
    // try{await sql.close(); }                    
    // catch(err){console.log("connection close error :" + err)}    
   
    try {
        if(json.results[0]!==undefined ){
            debugger;
            PriceID=0;
            sessionid= sessionid;
            CurID=json.currency_info.code;
            passenger= json.num_passengers;
            OccupancyTo=passenger;
            company_sessionid = json.search_id;
            Pricing=0; UnitID=0;Min_Stops=0;Max_Stops=0;
            Distance=0;
            SearchTimeStamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            _.forOwn(json.results,  function(value, key){
                //console.log(json.results[key].result_id)
                company_searchid=json.results[key].result_id;
                Price= json.results[key].total_price.total_price.value;
                Vehiclename= json.results[key].steps[0].details.vehicle.vehicle_type.name;
                count= json.results[key].steps[0].details.vehicle.num_vehicles;
                OccupancyFrom=json.results[key].steps[0].details.vehicle.max_passengers;                            
                vehicleclass= json.results[key].steps[0].details.description;
                VehicleImage= json.results[key].steps[0].details.vehicle.image;
                NumUnits= json.results[key].steps[0].details.vehicle.num_vehicles;
                company_name=json.results[key].steps[0].details.provider.name;
                company_logo=json.results[key].steps[0].details.provider.logo_url;
                duration= json.results[key].steps[0].details.time;
                Luggage_Big = json.results[key].steps[0].details.vehicle.max_bags;
                PartnerRating = json.results[key].steps[0].details.provider.rating;
                Transferflag=tflag
                if (Transferflag===1){
                    TotalCostPriceSingle=Price;
                    TotalCostPriceReturn=0;
                }
                else{
                    TotalCostPriceSingle=0;
                    TotalCostPriceReturn=Price;
                }
                
                 var sqlQuery=`INSERT INTO APISearchData (sessionid,PriceID,SearchTimeStamp,Pricing,Distance,UnitID,Vehicle,VehicleClass,OccupancyFrom,OccupancyTo,CurID,TotalCostPriceSingle,TotalCostPriceReturn,Min_Stops,Max_Stops,NumUnits,company_logo,Transferflag,VehicleImage,company,TransferType,company_sessionid,company_search_Resultid,duration,luggage_Big, PartnerRating)
                 values (${sessionid},${PriceID},getdate(),${Pricing},${Distance},${UnitID},${Vehiclename},${vehicleclass},${OccupancyFrom},${OccupancyTo},${CurID},${TotalCostPriceSingle},${TotalCostPriceReturn},${Min_Stops},${Max_Stops},${NumUnits},${company_logo},${Transferflag},${VehicleImage},${company_name},2,${company_sessionid},${company_searchid},${duration},${Luggage_Big},${PartnerRating})` 
                 //let result1 = pool.request()
                 //console.log(sqlQuery)
                 var request = new sql.Request(sqlConn);
                 let result = sql.query `INSERT INTO APISearchData (sessionid,PriceID,SearchTimeStamp,Pricing,Distance,UnitID,Vehicle,VehicleClass,OccupancyFrom,OccupancyTo,CurID,TotalCostPriceSingle,TotalCostPriceReturn,Min_Stops,Max_Stops,NumUnits,company_logo,Transferflag,VehicleImage,company,TransferType,company_sessionid,company_search_Resultid,duration,luggage_Big, PartnerRating)
                 values (${sessionid},${PriceID},getdate(),${Pricing},${Distance},${UnitID},${Vehiclename},${vehicleclass},${OccupancyFrom},${OccupancyTo},${CurID},${TotalCostPriceSingle},${TotalCostPriceReturn},${Min_Stops},${Max_Stops},${NumUnits},${company_logo},${Transferflag},${VehicleImage},${company_name},2,${company_sessionid},${company_searchid},${duration},${Luggage_Big},${PartnerRating})`                   

            })
    
            callback('','Success')
            return;
        }


    }
    catch(err){
        console.error("catch err :" + err);
        return callback ("catch err :" + err,'');
    }

    process.on('unhandledRejection', (reason, p) => {
        console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
        return;
      });
}