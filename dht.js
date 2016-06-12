var kade = require('./main.js')
var DHT = require('bittorrent-dht')
var jf = require('jsonfile')
require('colors')

kade.dht = {}

kade.dht.start = function () {
  kade.log('Starting MLDHT')
  kade.dht.connectionAttempt = 0
  kade.dht.attemptStart()
}

kade.dht.attemptStart = function (err) {

  if(kade.debugFlag){
     kade.log('Debug > spinning local DHT'.green);
     kade.dht.pending = 2

     kade.mldht = new DHT({ bootstrap: false, verify: kade.ed.verify })
     var dht2 = new DHT({ bootstrap: false, verify: kade.ed.verify })

     kade.mldht.listen(function () {
       dht2.addNode({ host: '127.0.0.1', port: kade.mldht.address().port })
       dht2.once('node', kade.dht.ready)
     })

     dht2.listen(function () {
       kade.mldht.addNode({ host: '127.0.0.1', port: dht2.address().port })
       //kade.mldht.once('node', kade.dht.ready)
    })

    return
  }

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

kade.dht.ready = function (err) {
  if (--kade.dht.pending) return

  if (err && err.host === "127.0.0.1"){
    kade.log('Local DHT successfully spinned')
    kade.sensors.autoPost()
  }
  else if(err && err.host !== "127.0.0.1")
    kade.dht.attemptStart(err)
  else if (err === undefined ){
    kade.log('MLDHT reached')
    kade.sensors.autoPost()
    clearTimeout(kade.dht.timeoutToken)
  }
}

kade.dht.publish = function(vals){

  // Update and write token
  kade.parameters.token++
  kade.saveParameters()

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
      kade.debug('    > ' + hash.toString('hex') + ' // ' + new Date().toTimeString().replace(' GMT+0100 (BST)', ''))
    }
  })
}

kade.dht.check = function(h, cb){
  kade.mldht.get(h, function (err, res) {
    if(!cb && err)
      kade.log(err)
    else if (cb && err && cb)
      return cb(err)
    else if (cb && !err && !res)
      return cb('ERROR: Nothing found at hash')
    else if (cb && !err && res)
      return cb( kade.decrypt(res.v).toString() )
  })
}

kade.dht.help = function () {
  kade.log('Helping fellow gateways')
}
