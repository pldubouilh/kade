var kade = require('./main.js')
var CAP = require ('./create_ap.js')

kade.ap = {}

var pairingConf = {
  path: kade.conf.ap.path,
  options: kade.conf.ap.pairingCmd,
  silent: kade.conf.ap.isVerb,
  wirelessInterface: kade.conf.ap.wifiif,
  wiredInterface: kade.conf.ap.wiredif,
  wifiApName: kade.conf.ap.pairingApName,
  wifiWPA: ''
}

var normalConf = {
  path: kade.conf.ap.path,
  options: kade.conf.ap.cmd,
  silent: kade.conf.ap.isVerb,
  wirelessInterface: kade.conf.ap.wifiif,
  wiredInterface: kade.conf.ap.wiredif,
  wifiApName: kade.parameters.apName ,
  wifiWPA: kade.parameters.apKey
}

kade.ap.start(mode){
  if ( kade.ap.createap !== undefined )
    kade.ap.stop()

  if(mode === 'normal')
    kade.ap.createap = new CAP(normalConf).start(cb)
  else if(mode === 'pairing')
    kade.ap.createap = new CAP(pairingConf).start(cb)

  function cb (msg) {
    if (msg === 'done')
      return
  }
}

kade.ap.stop(){
  if ( kade.ap.createap === undefined )
    return

  kade.ap.createap.stop()
}
