var processingStatus = (function () {
    this.initCount=0;
    this.requestData=function(dt){
        var fs = require("fs");
        var content = fs.readFileSync("../config/settings.json");
        const settings = JSON.parse(content);
        //console.log(JSON.stringify(settings))
        this.initCount = Object.keys(settings.provider).reduce(function (n, setting) {
            //console.log(dt[setting])
            if(dt[setting]==undefined){
                n = n + (settings.provider[setting] == '1')
             }
            return n 
        }, 0);
    };
    this.processComplete = function(){
        this.initCount=  this.initCount+1;
    }
    return this;
  })();

  processingStatus.requestData({"mozio":1,"taxicode":1})
  //HelloWorld.greeting()
  console.log (processingStatus.initCount)
 //module.exports = ProcessTracking;

 var one = new processingStatus();
 one.requestData({"mozio":1,"taxicode":1})
  console.log ("from one " + one.initCount)