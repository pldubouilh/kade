var ed = require('ed25519-supercop')
var jf = require('jsonfile')
var DHT = require('bittorrent-dht')
var ed = require('ed25519-supercop')
var crypto = require('crypto')

var kade = require('./main.js')

kade.dht = {}

kade.dht.readLocalParameters = function(){

  console.log('\n  Reading keypair');
  var params = jf.readFileSync(kade.conf.keypairLocation)

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
  kade.mldht = new DHT({ bootstrap: true, verify: ed.verify })

  kade.dht.timeoutToken = setTimeout(function () {
    kade.die('DHT Timeout. Can\'t seems to be able to connect to the internet.')
  }, kade.conf.dhtTimeout * 1000)
}


kade.dht.publish = function(vals){

  // Update and write token
  kade.parameters.token++
  jf.writeFileSync(kade.conf.keypairLocation, kade.parameters)

  // Set opts
  var opts = {
    k: kade.parameters.pub,
    seq: kade.parameters.token,
    v: kade.encrypt(vals),
    sign: function (buf) {
      var sig = ed.sign(buf, kade.parameters.pub, kade.parameters.priv)
      return sig
    }
  }

  kade.mldht.put(opts, function (err, hash) {
    if(err) kade.conf.die(err)
    console.log('\n    > DHT updated')
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
