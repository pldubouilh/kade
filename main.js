var kade = {}
module.exports = kade;

var events = require('events')
kade.ev = new events.EventEmitter()

require('./conf.js')
require('./utils.js')
require('./encryption.js')
require('./firstStart.js')
require('./dht.js')
require('./sensors.js')
require('./rpc.js')
require('colors')

kade.log('Starting kade !'.yellow)


if( kade.isFirstStart() )
  kade.firstStart()

kade.readParameters()

//kade.dht.start()
kade.sensors.start()
kade.rpc.start()
/*
kade.mldht.on('ready', function (err) {
  if(err)
    kade.dht.attemptStart(err)

  kade.log('MLDHT reached')
  clearTimeout(kade.dht.timeoutToken)
  kade.sensors.autoPost()
})
*/
