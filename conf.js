var kade = require('./main.js')
var colors = require('colors')
var crypto = require('crypto')
var jf = require('jsonfile')


kade.ed = require('ed25519-supercop')
// kade.ed = require('supercop.js')

kade.conf = {}
kade.parameters = {}

kade.version = '0.0.1'
kade.debug = true

kade.conf.fileName = 'kade.conf'
kade.conf.location = 'conf/' + kade.conf.fileName

kade.conf.dhtTimeout =   20 //secs
kade.conf.maxAttemptsDht = 3

kade.conf.refreshRateDht = 3 * 60 //secs
kade.conf.refreshRateSensors = 1 * 60 //secs

kade.readLocalParameters = function () {

  console.log('\n  Reading keypair')
  var params = jf.readFileSync(kade.conf.location)

  // Restore buffers
  params.pub = new Buffer(params.pub)
  params.priv = new Buffer(params.priv)
  params.salt = new Buffer(params.salt)
  params.pwd = new Buffer(params.pwd)
  kade.parameters = params
}

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
  console.log('\n  Woops ! Can\'t go any further...'.red)
  console.log('    > ' + err);
  process.exit(1);
}

kade.debug = function (msg){
  if(kade.debug)
    console.log(msg.yellow)
}

kade.warn = function (msg,err){
  console.warn('\n  '+ msg.red)
  console.log('    > ' + err);
}

kade.log = function (msg){
  console.log('\n  '+ msg)
}
