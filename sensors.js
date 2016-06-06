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
  console.log('\n')
  for (sensor in kade.sensors.list){
    console.log('  Getting value of sensor ' +  kade.sensors.list[sensor].name);
  }

  setTimeout(kade.sensors.postValues, kade.conf.refreshRateSensors * 1000)
}

kade.sensors.postValues = function() {
  kade.log('Posting values on the DHT ')
  kade.dht.publish( JSON.stringify(kade.sensors.list) )
  setTimeout(kade.sensors.postValues, kade.conf.refreshRateDht * 1000)
}
