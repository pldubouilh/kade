var DHT = require('bittorrent-dht')
var kade = require('./main.js')
var jf = require('jsonfile')

kade.dht = {}



kade.dht.start = function () {
  kade.log('Starting MLDHT')
  kade.dht.connectionAttempt = 0
  kade.dht.attemptStart()
}

kade.dht.attemptStart = function (err) {

  if (err){
    kade.warn('Can\'t contact the DHT. Reconnecting', err)
    kade.dht.connectionAttempt++
    if(kade.dht.connectionAttempt > kade.conf.maxAttemptsDht)
      kade.die('Cant\' reach the DHT. Trying again in 2mns.')
  }

  if (kade.mldht !== undefined)
    kade.mldht.destroy()

  kade.mldht = new DHT({ bootstrap: true, verify: kade.ed.verify })

  kade.dht.timeoutToken = setTimeout(function () {
    kade.mldht.destroy()
    kade.dht.attemptStart('Timeout')
  }, kade.conf.dhtTimeout * 1000)
}

kade.dht.publish = function(vals){

  // Update and write token
  kade.parameters.token++
  jf.writeFileSync(kade.conf.location, kade.parameters)

  // Set opts
  var opts = {
    k: kade.parameters.pub,
    seq: kade.parameters.token,
    v: kade.encrypt(vals),
    sign: kade.sign
  }

  kade.mldht.put(opts, function (err, hash) {
    if(err)
      kade.dht.attemptStart(err)
    else{
      console.log('    > DHT updated')
      kade.debug('    > ' + hash.toString('hex'))
      //kade.dht.check(hash)
    }
  })
}

kade.dht.check = function(h){
  kade.mldht.get(h, function (err, res) {
    debugger
    if(err) kade.log(err)
    kade.log(kade.decrypt(res.v))
  })
}

kade.dht.help = function () {
  kade.log('Helping fellow gateways')
}
