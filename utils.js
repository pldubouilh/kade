var kade = require('./main.js')
var colors = require('colors')
var jf = require('jsonfile')

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
