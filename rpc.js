var kade = require('./main.js')
var validateUuid = require('uuid-validate')
var uuid = require('uuid')
var express = require('express')

kade.rpc = {}

// init
var app = express()

// routers
var routerSensors = express.Router()
var routerDHT = express.Router()
app.use('/sensors', routerSensors)
app.use('/dht', routerDHT)

kade.rpc.start = function() {
  app.listen(kade.conf.rpcPort)
  kade.log('RPC started on port ' + kade.conf.rpcPort)
}

kade.rpc.isValidNewSensor = function (req) {
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
    if ( validateUuid(req.uuid) )
      return req
    else
      return 'ERROR: UUID Provided invalid'
}


// Finder returns only one !
kade.rpc.finder = function (query){
  var res = []
  var sensors = kade.parameters.sensors
  query = query.toLowerCase()

  for(var i=0; i<sensors.length; i++){
    if ( sensors[i].uuid === query )
      return [sensors[i]] // return if match in uuid
    else if( sensors[i].name.toLowerCase().indexOf(query) !== -1 )
      res.push(sensors[i])
    else if( sensors[i].uuid.toLowerCase().indexOf(query) !== -1 )
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


// Will match any GET /dht/*
routerDHT.get('*', function(req, res) {

  // Provide information on sensor if one's provided
  if (req.originalUrl === '/sensors' ||  req.originalUrl === '/sensors/'){
    res.json(kade.parameters.sensors) // barf all sensors
    return
  }

  if ( req.originalUrl.split('/')[4] !== undefined){
    res.json( 'ERROR: Too much args !' )
    return
  }

  // Accept values such as /dht/query/hash
  var query = req.originalUrl.split('/')[2]
  var hash = req.originalUrl.split('/')[3]

  if ( hash.length !== 40 || ! /[0-9A-Fa-f]$/i.test(hash) ){
    res.send('ERROR: Hash invalid')
    return
  }

  if(query === 'query'){
    kade.dht.check(hash, function(value){
      res.send(value)
    })
  }
  else
    res.send('ERROR: Invalid query')
});




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

  var sensorname, val, what

  // treat sensors?name=breakfast&value=off&uuid=a
  if( Object.keys(req.query).length !== 0 ){

    if ( req.query.name !== undefined )
      sensorname = req.query.name
    else if ( req.query.uuid !== undefined )
      sensorname = req.query.uuid

    what = Object.keys(req.query)[1]
    val = req.query[what]
  }

  // Accept values such as /sensor/oven/temp/200
  else{
    if (req.originalUrl === '/sensors' || req.originalUrl === '/sensors/'){
      res.json( 'ERROR : Need to provide a sensor name' )
      return
    }
    else if (req.originalUrl.split('/')[5] !== undefined){
      res.json( 'ERROR : Too much parameters provided' )
      return
    }

    sensorname = req.originalUrl.split('/')[2]
    what = req.originalUrl.split('/')[3]
    val = req.originalUrl.split('/')[4]
  }


  // Find errors
  if (sensorname === undefined  || sensorname.length === 0  ){
    res.json( 'ERROR : Need to provide name/uuid' )
    return
  }
  if ( what === undefined || val === undefined  || what.length === 0 || val.length === 0 ){
    res.json( 'ERROR : Invalid request' )
    return
  }

  // Try find one sensor
  var sensor = kade.rpc.findOne( sensorname , what )

  if (typeof sensor === 'string')
    res.json( sensor ) // error
  else
    res.json( kade.sensors.changeProp(sensor, what, val) )
});


// Will match any POST /sensors/*  >> Create new
routerSensors.post('*', function(req, res) {

  // Sanity check
  var sensor = kade.rpc.isValidNewSensor(req.query)

  if( typeof sensor === 'string' )
    res.json( sensor ) // error
  else
    res.json( kade.sensors.pushNewSensor(sensor) )

});
