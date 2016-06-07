var kade = {}
module.exports = kade;

var events = require('events')
kade.ev = new events.EventEmitter()

require('./conf.js')
require('./firstStart.js')
require('./dht.js')
require('./sensors.js')
require('colors')

kade.log('Starting kade !'.yellow)

if( kade.isFirstStart() )
  kade.firstStart()

kade.readLocalParameters()
kade.dht.start()
kade.sensors.start()

kade.mldht.on('ready', function (err) {
  if(err) kade.dht.attemptStart(err)

  clearTimeout(kade.dht.timeoutToken)
  kade.log('MLDHT reached')

  kade.sensors.autoPost()
})
