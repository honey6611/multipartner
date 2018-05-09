
require('events').EventEmitter.defaultMaxListeners = 10000;
var cp = require("child_process"),
         express = require("express"),
         app = express();

//app.configure(function(){
    app.use(express.static(__dirname));
//});

// processmonitor
const os = require('os')
console.log("Cpus: " + os.cpus());
console.log("Total mem" + os.totalmem());
console.log("Free mem" + os.freemem())
console.log("pid: "+process.pid )
console.log("Uptime: "+process.uptime(process.pid ) )

var CpuLoad ="";
function delta() {
  const cpus = os.cpus()

  return cpus.map(cpu => {
    const times = cpu.times
    return {
      tick: Object.keys(times).filter(time => time !== 'idle').reduce((tick, time) => { tick+=times[time]; return tick }, 0),
      idle: times.idle,
    }
  })
}

let startMeasures = delta()
setInterval(() => {
  const endMeasures = delta()
  const percentageCPU = endMeasures.map((end, i) => {
    return ((end.tick - startMeasures[i].tick) / (end.idle - startMeasures[i].idle) * 100).toFixed(3) //+ '%'
  })

 
  //console.log(percentageCPU.join(' '), '\n')
  CpuLoad =percentageCPU//.join('         ')
  // reset
  startMeasures = delta()
}, 2000)
//end of process monitor

var spw = cp.spawn('node', ['default.js'])
var lines
app.get('/msg', function(req, res){
    res.writeHead(200, { "Content-Type": "text/event-stream",
                         "Cache-control": "no-cache" });
    //var spw = cp.spawn('ping', ['-n', '100', '127.0.0.1']),

    str = "";

    spw.stdout.on('data', function (data) {
        str += data.toString();

        // just so we can see the server is doing something
        //console.log("data");
        //res.write("data")
        //Flush out line by line.
        lines = str.split("\n");
        for(var i in lines) {
            if(i == lines.length - 1) {
                str = lines[i];
            } else{
                // Note: The double-newline is *required*
                //res.write('data: ' + lines[i] + ",item:'my item' \n\n");
                totalmem=(parseInt(os.totalmem())/1000000000).toFixed(2);
                totalfreemem=(parseInt(os.freemem())/1000000000).toFixed(2);
                res.write(`data:{"Tool":"${lines[i]}", "nextkey":"nextval","CpuLoad":"${CpuLoad}","totalCpu":"${os.cpus().length}","TotalMem":"${totalmem}","FreeMem":"${totalfreemem}" } \n\n`)
            }
        }
    });

    setInterval(()=>{
        totalmem=(parseInt(os.totalmem())/1000000000).toFixed(2);
        totalfreemem= (parseInt(os.freemem())/1000000000).toFixed(2);        
        res.write(`data:{"Tool":"", "nextkey":"nextval","CpuLoad":"${CpuLoad}","totalCpu":"${os.cpus().length}" ,"TotalMem":"${totalmem}","FreeMem":"${totalfreemem}" } \n\n`)
    },1000
        )

    spw.on('close', function (code) {
        res.end(str);
    });


     spw.stderr.on('data', function (data) {
         //res.end('stderr: ' + data);
         str += data.toString();

         // just so we can see the server is doing something
         //console.log("data");
         //res.write("data")
         //Flush out line by line.
         var lines = str.split("\n");
         for(var i in lines) {
             if(i == lines.length - 1) {
                 str = lines[i];
             } else{
                 // Note: The double-newline is *required*
                 res.write('data: ' + lines[i] + "\n\n");
             }
         }         
     });
});

app.listen(4000);