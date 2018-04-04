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
