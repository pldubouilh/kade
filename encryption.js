var kade = require('./main.js')
var crypto = require('crypto')

kade.ed = require('ed25519-supercop')
// kade.ed = require('supercop.js')

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
