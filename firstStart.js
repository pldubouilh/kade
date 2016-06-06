var ed = require('ed25519-supercop')
var jf = require('jsonfile')
var kade = require('./main.js')
var sha1 = require('simple-sha1')
var crypto = require('crypto')


kade.isFirstStart = function(){
  try {
    jf.readFileSync(kade.conf.keypairLocation)
  } catch (e) {
    return true
  }
  return false
}


kade.firstStart = function () {
  kade.log('kade first start !');
  kade.genKeypair(kade.conf.keyName)
}


kade.genKeypair = function(fn){

  kade.log('Generating new keypair ' + fn);
  var keypair = ed.createKeyPair(ed.createSeed())

  kade.log('Public Key : ' + keypair.publicKey.toString('hex') )
  // kade.log('Secret Key : ' + keypair.secretKey.toString('hex') )

  var params = {
    pub: keypair.publicKey,
    priv: keypair.secretKey,
    token: 1,
    salt: crypto.randomBytes(50),
    pwd: crypto.randomBytes(50)
  }

  jf.writeFileSync(kade.conf.keypairLocation, params)
  kade.log('Keys generated !\n');
}
