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

kade.generateCert = function(){
  exec('openssl req -nodes -subj "/C=DE/ST=Internets/L=DHT/O=kade/OU=Org/CN=127.0.0.1" -x509 -newkey rsa:2048 -keyout conf/key.pem -out conf/cert.pem -days' + kade.conf.certDuration)
  return 1
}
