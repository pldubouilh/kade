var kade = require('./main.js')
var express = require('express')
var uuidvalidate = require('uuid-validate')
var uuid = require('uuid')

kade.rpc = {}

kade.rpc.isValid = function (req) {
  if (req === undefined )
    return 'ERROR: Invalid request'
  else if(typeof req !== 'object')
    return 'ERROR: Invalid request'
  else if( Object.keys(req).length === 0 )
    return 'ERROR: Invalid request'
  else if (req['name'] === undefined)
    return 'ERROR: Invalid request: no name provided'
  else if (req['uuid'] === undefined){
    req.uuid = uuid.v4()
    return req
  }
  else if (req['uuid'] !== undefined)
    if ( uuidvalidate(req.uuid) )
      return req
    else
      return 'ERROR: UUID Provided invalid'
}


// Finder returns only one !
kade.rpc.finder = function (query){
  var res = []
  var sensors = kade.parameters.sensors

  for(var i=0; i<sensors.length; i++){
    if ( sensors[i].uuid === query )
      return [sensors[i]] // return if match in uuid
    else if( sensors[i].name.indexOf(query) !== -1 )
      res.push(sensors[i])
  }

  if ( res.length === 0 )
    return 'ERROR : No match for that sensor'
  else
    return res
}


kade.rpc.findOne = function(sensorname){
  var sensor = kade.rpc.finder(sensorname)

  if ( sensor.length === 0 )
    return 'ERROR : No match for that sensor'
  else if ( sensor.length !== 1 )
    return 'ERROR: Sensor name not precise enough'
  else
    return sensor[0] // array 1 el > object
}


kade.rpc.findProp = function(sensorname, what){
  var sensor = kade.rpc.finder(sensorname)

  if ( sensor.length === 0 )
    return 'ERROR : No match for that sensor'
  else if ( sensor.length !== 1 )
    return 'ERROR: Sensor name not precise enough'
  else
    sensor = sensor[0] // array 1 el > object

  // Checking action validity...
  if ( sensor[what] === undefined )
    return 'ERROR: Action unknown for sensor'
  else
    return sensor[what]
}


var app = express()
var routerSensors = express.Router()
app.use('/sensors', routerSensors)


kade.rpc.start = function() {
  app.listen(kade.conf.rpcPort)
  kade.log('RPC started on port ' + kade.conf.rpcPort)
}


// Will match any GET /sensors/*
routerSensors.get('*', function(req, res) {

  // Provide information on sensor if one's provided
  if (req.originalUrl === '/sensors' ||  req.originalUrl === '/sensors/'){
    res.json(kade.parameters.sensors) // barf all sensors
    return
  }

  if ( req.originalUrl.split('/')[4] !== undefined){
    res.json( 'ERROR: Too much args !' )
    return
  }

  // Accept values such as /sensor/oven/temp
  var sensorname = req.originalUrl.split('/')[2]
  var what = req.originalUrl.split('/')[3]

  // prop provided, try find it
  if (sensorname !== undefined && what !== undefined ){
    var sensor = kade.rpc.findProp( sensorname , what )
    if (typeof sensor === 'string')
      res.json( sensor ) //error
    else
      res.json ( sensor ) // prop found !
  }
  else if (sensorname !== undefined && what === undefined) // no prop provided, try find sensor
    res.json( kade.rpc.finder(sensorname) )
});


// Will match any PUT /sensors/*  >> Amend state of sensor
routerSensors.put('*', function(req, res) {

  if (req.originalUrl === '/sensors' || req.originalUrl === '/sensors/'){
    res.json( 'ERROR : Need to provide a sensor name' )
    return
  }
  else if (req.originalUrl.split('/')[5] !== undefined){
    res.json( 'ERROR : Too much parameters provided' )
    return
  }

  // Accept values such as /sensor/oven/temp/200
  var sensorname = req.originalUrl.split('/')[2]
  var what = req.originalUrl.split('/')[3]
  var val = req.originalUrl.split('/')[4]

  if ( what === undefined || val === undefined  || what.length === 0 || val.length === 0 ){
    res.json( 'ERROR : Invalid request' )
    return
  }

  var sensor = kade.rpc.findOne( sensorname , what )

  if (typeof sensor === 'string')
    res.json( sensor ) // error
  else
    res.json( kade.changePropAndSave(sensor, what, val) )
});


// Will match any POST /sensors/*  >> Create new
routerSensors.post('*', function(req, res) {

  var sensor = kade.rpc.isValid(req.query)

  if( typeof sensor === 'string' )
    res.json( sensor )
  else {
    kade.parameters.sensors.push(sensor)
    kade.saveParameters()
    res.json( sensor )
  }

});
