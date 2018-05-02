// Logs in google big query
// Imports the Google Cloud client library
process.env.GOOGLE_APPLICATION_CREDENTIALS="./MultiSupplier-8bbf3d1a9836.json"
const BigQuery = require('@google-cloud/bigquery');
let moment = require('moment');
/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
 const projectId = "multisupplier-202013";
 const datasetId = "ToolLogs";
 const tableId = "logs";

 module.exports = function(data,cb){
    cb(null,''); // return control. Dont need to wait for logs to finish
    const rows = [{"SessionId": data.SessionId,"PartnerName": data.PartnerName,"Category": data.Category,"SubCategory": data.SubCategory,"Body": data.Body,"CreatedOn" : moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')}];
    //const rows = [{"SessionId": "123","PartnerName": "Mozio","Category": "Some Cat","SubCategory": "Some Sub Cat","Body": "some body data","CreatedOn" : moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')}];

    // Creates a client
    const bigquery = new BigQuery({
        projectId: projectId,
    });

    // Inserts data into a table
    bigquery
    .dataset(datasetId)
    .table(tableId)
    .insert(rows)
    .then(() => {
        console.log(`Create Log Inserted ${rows.length} rows`);
        //cb(null,`Create Log Inserted ${rows.length} rows`);
    })
    .catch(err => {
        if (err && err.name === 'PartialFailureError') {
        if (err.errors && err.errors.length > 0) {
            console.log('Create Log Insert errors:');
            err.errors.forEach(err => console.error(err));
        }
        } else {
        console.error('Create Log ERROR:', err);
        }
        //cb(err,null);
    });
 }
/*end of google big query */


/*
uncomment below for mongo db

var MongoClient = require("mongodb").MongoClient;
//var url = "mongodb://127.0.0.1:27017/";
let moment = require('moment')

module.exports = function(data,cb){
    cb(null,'');
    // MongoClient.connect(url,function(err,db){
    //     if(err) throw err;
    //     var dbo = db.db("hoppaDB")
    //     var myobj = {
    //         "SessionId": data.SessionId,
    //         "PartnerName": data.PartnerName,
    //         "Category": data.Category,
    //         "SubCategory": data.SubCategory,
    //         "Body": data.Body,
    //         "CreatedOn" : moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    //     }
    //     dbo.collection("note").insertOne(myobj,function(err,res){
    //         if (err) {throw err};
    //         //console.log("1 document inserted");
    //         db.close();
    //         cb(null,res);
    //         //return
    //     })
    // })
}
*/