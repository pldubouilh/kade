var jf = require('jsonfile')
var kade = require('./main.js')
var sha1 = require('simple-sha1')
var crypto = require('crypto')
var randomstring = require("randomstring");

kade.isFirstStart = function(){
  try {
    jf.readFileSync(kade.conf.location)
  } catch (e) {
    return true
  }
  return false
}


kade.firstStart = function () {
  kade.log('first start !');
  kade.genKeypair()
}


kade.genKeypair = function(){

  kade.log('Generating new keypair ' + kade.conf.fileName );
  var keypair = kade.ed.createKeyPair(kade.ed.createSeed())

  kade.log('Public Key : ' + keypair.publicKey.toString('hex') )
  // kade.log('Secret Key : ' + keypair.secretKey.toString('hex') )

  var params = {
    pub: keypair.publicKey,
    priv: keypair.secretKey,
    token: 1,
    salt: crypto.randomBytes(50),
    pwd: crypto.randomBytes(50),
    apName: randomstring.generate(10),
    apKey: randomstring.generate(20),
    sensors: [{
      name: 'kettle',
      value: 'off'
    },{
      name: 'boiler',
      value: 'off'
    }]
  }

  jf.writeFileSync(kade.conf.location, params)
  kade.log('Keys generated !\n');
}
