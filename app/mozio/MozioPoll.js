// Polling Mozio data for search results
let https = require('https');
let querystring = require('querystring');
var setting = require('../../config');
module.exports = {
  SearchPoll: function(r_searchid,cbackfunc){searchPoll(r_searchid,cbackfunc)},
  BookPoll : function(r_searchid,cbackfunc){bookPoll(r_searchid,cbackfunc)}
}



function searchPoll(response_searchid,callbackfunc){
  if(response_searchid!==undefined && response_searchid!=='' ){
    //console.log(response_searchid)
    var options = {
      host: setting.provider.mozio.host,
      port: 443,
      method: 'GET',
      path: '/v2/search/'+response_searchid+'/poll/',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'API-KEY':setting.provider.mozio.api_key
      }
    };    
      // request object
      var Subreq = https.request(options, (Subreq)=> {
        var result = '';
        Subreq.on('data', (chunk)=> {
          result += chunk;
        });
        Subreq.on('end', ()=> {
              callbackfunc(result)
        });
        Subreq.on('error', (err)=> {
          console.error(err);
        })
      })
      Subreq.write('');
      Subreq.end();
  }
  else{
    return callbackfunc('Error:');
  }
}


function bookPoll(response_searchid,callbackfunc){
  if(response_searchid!==undefined && response_searchid!=='' ){
    console.log(response_searchid)
    var options = {
      host: setting.provider.mozio.host,
      port: 443,
      method: 'GET',
      path: '/v2/reservations/'+response_searchid+'/poll/',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'API-KEY':setting.provider.mozio.api_key
      }
    };    
      // request object
      var Subreq = https.request(options, (Subreq)=> {
        var result = '';
        Subreq.on('data', (chunk)=> {
          result += chunk;
        });
        Subreq.on('end', ()=> {
              callbackfunc(result)
        });
        Subreq.on('error', (err)=> {
          console.error(err);
        })
      })
      Subreq.write('');
      Subreq.end();
  }
  else{
    return callbackfunc('Error:');
  }
}