var kade = require('./main.js')
var colors = require('colors')
var jf = require('jsonfile')

kade.readParameters = function () {
  console.log('\n  Reading local parameters')
  var params = jf.readFileSync(kade.conf.location)

  // Restore buffers
  params.pub = new Buffer(params.pub)
  params.priv = new Buffer(params.priv)
  params.salt = new Buffer(params.salt)
  params.pwd = new Buffer(params.pwd)
  kade.parameters = params
}

kade.changePropAndSave = function (sensor, what, where){
  // Find value to change and store
  var i
  for ( i=0; i < kade.parameters.sensors.length; i++ ){
    if( kade.parameters.sensors[i].uuid === sensor.uuid ){
      if ( kade.parameters.sensors[i][what] !== undefined ) {
        kade.parameters.sensors[i][what] = where
        kade.saveParameters()
        return kade.parameters.sensors[i]
      }
      else
        return 'ERROR: Propriety not found'
    }
  }
}

kade.saveParameters = function () {
  jf.writeFileSync(kade.conf.location, kade.parameters)
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
