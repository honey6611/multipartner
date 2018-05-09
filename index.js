const sql = require('mssql')
var express = require('express');
var Connection = require('tedious').Connection;  
var app = express();

app.get('/', function (req, res) {
	const config = {
		user: 'transfer',
		password: '!@34%^',
		server: '10.10.10.203', 
		port: '1433',
		database: 'Unique_Golf' 
	};

    var connection = new Connection(config);  
    connection.on('connect', function(err) {  
    // If no error, then good to proceed.  
		console.log("Connected");  
		executeStatement();  
	}); 
	
    var Request = require('tedious').Request;  
    var TYPES = require('tedious').TYPES;  

    function executeStatement() {  
        request = new Request(`select * from agents where agentid = ${req.query.id}`, function(err) {  
        if (err) {  
            console.log(err);}  
        });  
        var result = "";  
        request.on('row', function(columns) {  
            columns.forEach(function(column) {  
              if (column.value === null) {  
                console.log('NULL');  
              } else {  
                result+= column.value + " ";  
              }  
            });  
            console.log(result);  
            result ="";  
        });  

        request.on('done', function(rowCount, more) {  
        console.log(rowCount + ' rows returned');  
        });  
        connection.execSql(request);  
	} 
	

	// connect to your database
	//sql.connect(config, function (err) {

		//if (err) console.log(err);

		// create Request object
		//var request = new sql.Request();
		
		//if req.query.id<>"" then
		//var sql=`select top 100 * from agents `
		// query to the database and get the records
		//request.query(`select * from agents where agentid = ${req.query.id}`, function (err, recordset) {
		//request.query(sql, function (err, recordset) {
			/*if (err) console.log(err)

			// send records as a response
			res.setHeader('Content-Type', 'application/json');
			res.send(recordset);
			//res.send('id: ' + req.query.id);
			//console.log(recordset)
			sql.close() */
		//});
	//});
});	

var server = app.listen(5000, function () {
    console.log('Server is running..');
});
