const sql = require('mssql')
/*var poolConfig = {
    min: 2,
    max: 4,
    log: true
};*/

var config = {  
    user: 'transfer',
    password: '!@34%^',
    server: '10.10.10.203', 
    port: '1433',
    database: 'Unique_Golf' ,
    // When you connect to Azure SQL Database, you need these next options.  
   // options: {encrypt: true, database: 'Unique_Golf'}  
};  
(async function () {
    try {
        let pool = await sql.connect(config)
        var table = new sql.Table('#atable');
        table.create = true;
        table.columns.add('a', sql.Int, { nullable: false});
        table.rows.add(15);
        table.rows.add(16);
        table.rows.add(17);
        var request = new sql.Request();
        request.bulk(table, function(err, rowCount){
           if(err){
               console.log('bulk insert error');
               console.log(err);
               return;
           } 
           request.query(`INSERT INTO test4
            SELECT a
            FROM   #atable`, function(err, rowCount){
                if(err){console.dir(err)}
            })
            request.query('select * from #atable', function(err, recordset){
           if(err){
               console.log('taco error:' + err);
               return;
           } 
           console.log('taco recordset:');
           console.log(recordset);
        });
        });        
        /*let result1 = await pool.request()
            .input('input_parameter', sql.Int, '60042')
            .query('select * from agents where agentid = @input_parameter')
        */    
        //console.dir(result1)
        /*let result2 = await pool.request()
        .input('input_parameter', sql.Int, '4')
        .query('insert into test4 (a) values(@input_parameter)')  

        console.dir(result2)       
        */

        /*
        const table = new sql.Table('#test4') // or temporary table, e.g. #temptable
        table.create = true
        table.columns.add('a', sql.Int, { nullable: false});
        table.rows.add('6')
        
        const request = new sql.Request()
        request.bulk(table, (err, result) => {
            // ... error checks
            console.log(result)
        })
        let result1 = await pool.request()
        .query('SELECT TOP (1000) [a]  FROM #test4')
        console.log(result1)*/
        //let result2 = await pool.request()
        //.query('SELECT TOP (1000) [a]  FROM #test4')
        //console.log(result2)
        //console.dir(result2)        
        // Stored procedure
        
        //let result2 = await pool.request()
        //    .input('input_parameter', sql.Int, value)
        //    .output('output_parameter', sql.VarChar(50))
        //    .execute('procedure_name')
        
       // console.dir(result2)
    } catch (err) {
        // ... error checks

    }
})()

sql.on('error', err => {
    // ... error handler
})