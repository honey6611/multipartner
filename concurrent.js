
var http = require('http');
var totalUrl = 5;
var currentUrl = 0;
 
var totalLoop = 2;
for( var i = 0; i < totalLoop; i++ ) {
    setTimeout(function(){
        getNextUrl();},4000)
}
 
function getNextUrl(){
 
    var idToFetch = currentUrl++;
 
    if(currentUrl >= totalUrl){
        console.log("nothing else to do for this worker");
        return;
    }
   

   if(process.argv[2]=='undefine')
        var options = {
        host: 'localhost',
        port: 3001,
        path: '/search/?callid='+idToFetch+'&sessionid=99999&AgentID=60042&CodeFrom=ALC&CodeTo=BEN&Adults=2&Child=0&Infant=0&FromDate=20180415&ToDate=20180428&FromTime=1400&ToTime=1200&FromLat=51.4703&FromLong=-0.45342&ToLat=50.8197675&ToLong=-1.0879769000000579&currencyid=USD',
        agent: false,
        pageId: idToFetch
        };
    else{
        var options = {
            host: '192.168.0.90',
            port: 5000,
            path: '/api/multiprovider/?AgentID=60042&SessionID=2460525e-384c-4271-b54b-45ca48430719&CurrencyID=GBP&CodeFrom=ALC&CodeTo=BEN&Adults=2&FromDate=20180220&FromTime=1030&ToDate=20180228&ToTime=1530&FromLat=51.4703&FromLong=-0.45342&ToLat=50.8197675&ToLong=-1.0879769000000579&PartnerList=123,234',
            agent: false,
            pageId: idToFetch
        };
    }
    http.get(options, function(res) {
        var pageData = "";
 
        res.resume();
        res.on('data', function (chunk) {
            if(res.statusCode == 200){
                pageData +=chunk;
            }
        });
 
        res.on('end', function() {
            console.log("finish to fetch id: "+options.pageId);
            console.log(pageData)
            // do something with the HTML page
 
            getNextUrl(); //call the next url to fetch
        });
 
    }).on('error', function(e) {
       console.log("Error: " + options.host + "\n" + e.message);
       getNextUrl();
    });
}