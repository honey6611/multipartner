var env = require('./config.json');

var settings = (function() {
  var node_env = process.env.NODE_ENV || 'dev';
  //console.log(node_env.toLowerCase())  
  //if(node_env.toLowerCase()!='prod' && node_env.toLowerCase()!='dev'){
  //  node_env="dev"
  //}
  console.log(node_env)
  if(node_env=="dev"){console.log("Running in Dev mode")}
  return env[node_env];
})(); 

module.exports = settings