var kade = require('./main.js')
var colors = require('colors')
var crypto = require('crypto')


kade.ed = require('ed25519-supercop')
// kade.ed = require('supercop.js')

kade.conf = {}

kade.parameters = {}

kade.version = '0.0.1'

kade.conf.fileName = ''
kade.conf.location = 'conf/' + kade.conf.fileName

kade.conf.dhtTimeout =   20 //secs
kade.conf.refreshRateDht = 2 * 60 //secs
kade.conf.refreshRateSensors = 3 * 60 //secs


kade.encrypt = function (what){
  var cryptoKey = crypto.pbkdf2Sync(kade.parameters.pwd, kade.parameters.salt, 15000, 256)
  var cipher = crypto.createCipher('aes-256-ctr',cryptoKey)
  return Buffer.concat([cipher.update(what),cipher.final()]);
}

kade.decrypt = function (what){
  var cryptoKey = crypto.pbkdf2Sync(kade.parameters.pwd, kade.parameters.salt, 15000, 256)
  var decipher = crypto.createDecipher('aes-256-ctr',cryptoKey)
  return Buffer.concat([decipher.update(what) , decipher.final()]);
}

kade.sign = function (buf) {
  return kade.ed.sign(buf, kade.parameters.pub, kade.parameters.priv)
}

kade.die = function(err){
  console.log('\n  Woops ! Can\'t go any further...\n'.red)
  console.log('  >> ' + err);
  process.exit(1);
}

kade.log = function (msg){
  console.log('\n  '+msg)
}
