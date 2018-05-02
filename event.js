require('events').EventEmitter.defaultMaxListeners = 10000;
var cp = require("child_process"),
         express = require("express"),
         app = express();

//app.configure(function(){
    app.use(express.static(__dirname));
//});


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

app.get('/msg', function(req, res){
    res.writeHead(200, { "Content-Type": "text/event-stream",
                         "Cache-control": "no-cache" });    
    setInterval(()=>{
        totalmem=(parseInt(os.totalmem())/1000000000).toFixed(2);
        totalfreemem= (parseInt(os.freemem())/1000000000).toFixed(2);        
        res.write(`data:{"Tool":"", "nextkey":"nextval","CpuLoad":"${CpuLoad}","totalCpu":"${os.cpus().length}" ,"TotalMem":"${totalmem}","FreeMem":"${totalfreemem}" } \n\n`)
    },
    1000)
})

app.listen(4001);