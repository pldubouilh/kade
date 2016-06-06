var jf = require('jsonfile')
var DHT = require('bittorrent-dht')
var crypto = require('crypto')

var kade = require('./main.js')

kade.dht = {}

kade.dht.readLocalParameters = function(){

  console.log('\n  Reading keypair');
  var params = jf.readFileSync(kade.conf.location)

  // Restore buffers
  params.pub = new Buffer(params.pub)
  params.priv = new Buffer(params.priv)
  params.salt = new Buffer(params.salt)
  params.pwd = new Buffer(params.pwd)
  kade.parameters = params
}


kade.dht.start = function(){

  kade.dht.readLocalParameters()
  kade.log('Starting MLDHT')
  kade.dht.attemptStart()
}

kade.dht.attemptStart =  function () {

  kade.mldht = new DHT({ bootstrap: true, verify: kade.ed.verify })

  kade.dht.timeoutToken = setTimeout(function () {
    kade.log('DHT Timeout. Can\'t seems to be able to connect to the internet.')
    kade.mldht.destroy()
    kade.dht.attemptStart()
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
    if(err) kade.die(err)
    console.log('    > DHT updated')
    //kade.dht.check(hash)
  })
}

kade.dht.check = function(h){
  kade.mldht.get(h, function(err, res){
    debugger;
    kade.log(kade.decrypt(res.v))
  })
}

kade.dht.help = function(){
  kade.log('Helping fellow gateways')
}
