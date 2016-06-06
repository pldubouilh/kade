var kade = {}
module.exports = kade;

require('./conf.js')
require('./firstStart.js')
require('./dht.js')
require('./sensors.js')


if( kade.isFirstStart() )
  kade.firstStart()

kade.log('Starting kade !')

kade.dht.start()

kade.mldht.on('ready', function (err) {
  if (err) kade.die(err);

  clearTimeout(kade.dht.timeoutToken)
  kade.log('MLDHT reached')

  kade.sensors.refeshValues()
  kade.sensors.postValues()
})


//checkAndPost()
