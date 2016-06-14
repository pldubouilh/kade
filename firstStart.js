var jf = require('jsonfile')
var kade = require('./main.js')
var sha1 = require('simple-sha1')
var crypto = require('crypto')
var randomstring = require('randomstring');

kade.isFirstStart = function(){
  try {
    jf.readFileSync(kade.conf.location)
  } catch (e) {
    return true
  }
  return false
}


kade.firstStart = function () {
  kade.log('First start !');
  kade.genKeypair()
}


kade.genKeypair = function(){

  kade.log('Generating certificate')
  kade.generateCert()

  kade.log('Generating new keypair ' + kade.conf.fileName )
  var keypair = kade.ed.createKeyPair(kade.ed.createSeed())

  // kade.log('Public Key : ' + keypair.publicKey.toString('hex') )
  // kade.log('Secret Key : ' + keypair.secretKey.toString('hex') )

  if (kade.debugFlag) {
    kade.log('Creating dummy sensors for debugging')
    var sensors = [{
      name: 'kettle',
      uuid: '3AFB6BD1-3270-4F31-A2B1-626D73099CAF',
      value: 'off'
    },{
      name: 'boiler',
      uuid: 'FA725932-2DD8-4995-B3C6-0BC55C9B7671',
      value: 'off',
      temp: 21
    }]
  }
  else
    var sensors = []


  var params = {
    pub: keypair.publicKey,
    priv: keypair.secretKey,
    token: 1,
    salt: crypto.randomBytes(50),
    pwd: crypto.randomBytes(50),
    apName: randomstring.generate(10),
    apKey: randomstring.generate(20),
    sensors: sensors
  }

  jf.writeFileSync(kade.conf.location, params)
}
