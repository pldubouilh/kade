var kade = require('./main');
var crypto = require('crypto')

kade.sensors = {}

kade.sensors.update = function () {
  setTimeout(kade.sensors.update, kade.conf.refreshRateSensors * 1000)
  
  kade.log('Getting sensors values');
  for (sensor in kade.parameters.sensors){
    console.log('    * Updating sensor : ' +  kade.parameters.sensors[sensor].name);
  }
}

kade.sensors.prepValues = function() {
  return JSON.stringify( kade.sensors.list )
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
