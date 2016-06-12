var events = require('events')
require('colors')

var kade = {}
module.exports = kade
kade.ev = new events.EventEmitter()

require('./conf.js')
require('./utils.js')
require('./encryption.js')
require('./firstStart.js')
require('./dht.js')
require('./sensors.js')
require('./rpc.js')
require('./ap.js')


kade.log('Starting kade !'.yellow)


if( kade.isFirstStart() )
  kade.firstStart()

kade.readParameters()

kade.dht.start()
//kade.ap.start('normal')
kade.rpc.start()


kade.mldht.on('ready', function (err) {
  if(err)
    kade.dht.attemptStart(err)

  kade.log('MLDHT reached')
  clearTimeout(kade.dht.timeoutToken)
  kade.sensors.autoPost()
})


process.on('SIGINT', function () {
  //kade.ap.stop(function (msg) {
  //  console.log(msg);
  //})
  process.exit();
});
