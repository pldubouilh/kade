var kade = require('./main.js')
var express = require('express')
require('colors')

var app = express()
var routerSensors = express.Router();
app.use('/sensors', routerSensors);


kade.rpc = {}

kade.rpc.isValid = function (req) {
  if(typeof req !== 'object')
    return false

  // might be worth checking for name & uuid...
  return true
}

kade.rpc.finder = function (query){
  var res = []
  var sensors = kade.parameters.sensors

  for(var i=0; i<sensors.length; i++){
    if ( sensors[i].uuid === query )
      return sensors[i]
    else if( sensors[i].name.indexOf(query) !== -1 )
      res.push(sensors[i])
  }

  // return partial match if any
  return res
}

kade.rpc.start = function() {
  app.listen(kade.conf.rpcPort);
  kade.log('RPC started on port ' + kade.conf.rpcPort);
}


// Will match any GET /sensors/*
routerSensors.get('*', function(req, res) {
  // Provide information on sensor if one's provided
  if (req.originalUrl !== '/sensors')
    res.json( kade.rpc.finder( req.originalUrl.split('/')[2] ) )
  else
    res.json(kade.parameters.sensors)
});


// Will match any POST /sensors/*
routerSensors.post('*', function(req, res) {
  if(!kade.rpc.isValid(req.query))
    res.json( '' )

  kade.parameters.sensors.push(req.query)
  kade.saveParameters()
  res.json( 'Ok !' )
});
