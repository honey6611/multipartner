
const sql = require('mssql')
var sqlConn = sql.globalConnection;
//const config = require('../config/databaseConnection')
let _ = require('lodash');
let moment = require('moment');
var setting = require('../../config/settings.json');

module.exports = async function insert(result,sessionid,tflag,callback){
    var company_name,company_logo,SearchTimeStamp,quotes,vehicle
    var PriceID,Vehiclename,VehicleImage,passenger,luggage_big,luggage_small,NumUnits,id,vehicleclass,vehicleMake,Transferflag,sessionid,OccupancyFrom
    var CurID,UnitID,Min_Stops,Max_Stops,Transferflag, distance,duration,Company_sessionid
    var Luggage_Big,Luggage_Small,PartnerRating,PartnerReviewCount,vehicleType
    var json = JSON.parse(result); 
    var table
    var CurID = (result.currencyid==='' || result.currencyid===undefined ? 'GBP' : result.currencyid)
    // try{await sql.close(); }                    
    // catch(err){console.log("connection close error :" + err)}    
    try {
    //const pool = await sql.connect(config)
    var request = new sql.Request(sqlConn);
        distance=json.journey.distance;
        duration=json.journey.duration;
        Company_sessionid= json.journey_id
        duration = isNaN(duration)?'': Math.round(duration/60)
        _.forOwn(json,  function(value, key) {
            //console.log(key+':' + value)
            if(key=="quotes"){
            _.forOwn(value,  function(quotes, key1) { // each quote ex: 1A0E62FBDAEAB41F3A60969DE125C153

                //console.log(key1+':' + value1)
                company_search_Resultid= key1;
                company_name=quotes.company_name;
                company_logo=quotes.company_logo.url;
                company_logo=company_logo==undefined ? '' : company_logo
                PartnerRating = quotes.rating.score;
                PartnerReviewCount=quotes.rating.ratings;
                //console.log('company_logo :' + company_logo)
                _.forOwn(quotes,  function(value2, key2) {
                    //console.log(key2+':' + value2)
                    if(key2=="vehicles"){ // inside vehicles object
                    //console.log(key2+':' + value2)
                    _.forOwn(value2,  function(vehicle, key3) {
                        PriceID=vehicle.id;
                        Price= vehicle.price;
                        passenger= vehicle.passengers;
                        Vehiclename= vehicle.name;//
                        Pricing=0; UnitID=0;Min_Stops=0;Max_Stops=0;
                        luggage_big= vehicle.luggage_big;
                        luggage_small= vehicle.luggage_small;
                        count= vehicle.count;
                        OccupancyFrom=1;                
                        vehicleclass= vehicle.type.class;
                        vehicleType=vehicle.type.type;
                        VehicleImage= vehicle.image;
                        NumUnits= vehicle.count;
                        OccupancyTo=vehicle.passengers;
                        sessionid= sessionid;
                        Luggage_Big=vehicle.luggage_big;
                        Luggage_Small=vehicle.luggage_small;
                        SearchTimeStamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
                        Transferflag=tflag
                        if (Transferflag===1){
                        TotalCostPriceSingle=Price;
                        TotalCostPriceReturn=0;
                        }
                        else{
                            TotalCostPriceSingle=0;
                            TotalCostPriceReturn=Price;
                        }

                        var InserQuery=`INSERT INTO APISearchData (sessionid,PriceID,SearchTimeStamp,Pricing,Distance,duration,UnitID,Vehicle,OccupancyFrom,OccupancyTo,CurID,TotalCostPriceSingle,TotalCostPriceReturn,Min_Stops,Max_Stops,NumUnits,company_logo,Transferflag,VehicleImage,company,company_search_Resultid,supplierid,Company_sessionid)
                        values ('${sessionid}','${PriceID}','${SearchTimeStamp}','${Pricing}','${distance}','${duration}','${UnitID}','${Vehiclename}','${OccupancyFrom}','${OccupancyTo}','${CurID}','${TotalCostPriceSingle}','${TotalCostPriceReturn}','${Min_Stops}','${Max_Stops}','${NumUnits}','${company_logo}','${Transferflag}','${VehicleImage}','${company_name}',${company_search_Resultid},${setting.provider.taxicode.id},${Company_sessionid})`
                        //console.log(InserQuery)
                        //let result1 = sql.request()
                        let result1 = sql.query `INSERT INTO APISearchData (sessionid,PriceID,SearchTimeStamp,Pricing,Distance,duration,UnitID,Vehicle,vehicleClass,vehicleMake,OccupancyFrom,OccupancyTo,CurID,TotalCostPriceSingle,TotalCostPriceReturn,Min_Stops,Max_Stops,NumUnits,company_logo,Transferflag,VehicleImage,company,company_search_Resultid,supplierid,Company_sessionid,TransferType,Luggage_Big,Luggage_Small,partnerRating,partnerReviewCount)
                        values (${sessionid},${PriceID},getdate(),${Pricing},${distance},${duration},${UnitID},${vehicleType},${vehicleclass},${Vehiclename},${OccupancyFrom},${OccupancyTo},${CurID},${TotalCostPriceSingle},${TotalCostPriceReturn},${Min_Stops},${Max_Stops},${NumUnits},${company_logo},${Transferflag},${VehicleImage},${company_name},${company_search_Resultid},${setting.provider.taxicode.id},${Company_sessionid},2,${Luggage_Big},${Luggage_Small},${PartnerRating},${PartnerReviewCount})`
                    })
                    }   
                })
            })
            } // if(key=="quotes")
        }); 
        return callback('','Success')
    }
    catch(err){
        console.error("catch err :" + err);
        return callback('','Success')
    }

    //process.on('unhandledRejection', (reason, p) => {
    //    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
        // application specific logging, throwing an error, or other logic here
    //  });
}