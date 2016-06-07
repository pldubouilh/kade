var kade = require('./main');
var crypto = require('crypto')

kade.sensors = {}

kade.sensors.list = [{
    name : 'boiler',
    value: 'on'
  },{
    name: 'kettle',
    value: 'steamin !'
  }]

kade.sensors.refeshValues = function () {
  setTimeout(kade.sensors.refeshValues, kade.conf.refreshRateSensors * 1000)

  kade.log('Getting sensors values');
  for (sensor in kade.sensors.list){
    console.log('    * Getting value of sensor : ' +  kade.sensors.list[sensor].name);
  }
}

kade.sensors.getValues = function() {
  return JSON.stringify(kade.sensors.list)
}

kade.sensors.start = function () {
  kade.log('Starting sensors process');
  kade.sensors.refeshValues()
}

kade.sensors.autoPost = function () {
  setTimeout(kade.sensors.autoPost, kade.conf.refreshRateSensors * 1000)
  kade.log('Posting sensors values on the DHT...')
  kade.dht.publish( kade.sensors.getValues() )
}
