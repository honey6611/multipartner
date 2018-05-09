var cpuStat = require('cpu-stat');



console.log("CPU Stat : " +cpuStat.avgClockMHz())

var totalCores = cpuStat.totalCores();
//console.log(totalCores)

setInterval(()=>{
    //console.clear();
    for(var j=1; j<=totalCores; j++){
        debugger;
        veiwcore(j-1)
    }
},2000)


function veiwcore(c){
    cpuStat.usagePercent({
        coreIndex: c,
        sampleMs: 2000,
      },
      function(err, percent, seconds) {
        if (err) {
          return console.log(err);
        }
     
        //the percentage cpu usage for core 0
        console.log(`core ${c} : percentage usage ${percent.toFixed(2)} %` );
        console.log("Uptime : "+process.uptime(process.pid) )
        console.log("===========================================")
        //the approximate number of seconds the sample was taken over
        //console.log(`core ${c} : ` + seconds);
    });
}

