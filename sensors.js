var kade = require('./main');
var crypto = require('crypto')

kade.sensors = {}

kade.sensors.changeProp = function (sensor, what, where){
  // Find value to change and store
  var i
  for ( i=0; i < kade.parameters.sensors.length; i++ ){
    if( kade.parameters.sensors[i].uuid === sensor.uuid ){
      if ( kade.parameters.sensors[i][what] !== undefined ) {
        kade.parameters.sensors[i][what] = where
        kade.saveParameters()
        return kade.parameters.sensors[i]
      }
      else
        return 'ERROR: Propriety not found'
    }
  }
}

kade.sensors.pushNewSensor = function (sensor){
  kade.parameters.sensors.push(sensor)
  kade.saveParameters()
}

kade.sensors.update = function () {
  setTimeout(kade.sensors.update, kade.conf.refreshRateSensors * 1000)

  kade.log('Getting sensors values');
  for (sensor in kade.parameters.sensors){
    console.log('    * Updating sensor : ' +  kade.parameters.sensors[sensor].name);
  }
}

kade.sensors.prepValues = function() {
  return JSON.stringify( kade.parameters.sensors )
}

kade.sensors.start = function () {
  kade.log('Starting sensors process');
  kade.sensors.update()
}

kade.sensors.autoPost = function () {
  setTimeout(kade.sensors.autoPost, kade.conf.refreshRateSensors * 1000)
  kade.log('Posting sensors values on the DHT...')
  kade.dht.publish( kade.sensors.prepValues() )
}
