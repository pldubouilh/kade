var kade = require('./main.js')
var jf = require('jsonfile')

kade.conf = {}
kade.conf.ap = {}
kade.parameters = {}

kade.version = '0.0.1'
kade.debug = true

kade.conf.fileName = 'kade.conf'
kade.conf.location = 'conf/' + kade.conf.fileName

kade.conf.dhtTimeout =   20 //secs
kade.conf.maxAttemptsDht = 3

kade.conf.rpcPort = 8081

kade.conf.refreshRateDht = 3 * 60 //secs
kade.conf.refreshRateSensors = 1 * 60 //secs

kade.conf.ap.path = '/home/pi/create_ap/create_ap'
kade.conf.ap.wiredif = 'eth0'
kade.conf.ap.wifiif = 'wlan0'
kade.conf.ap.pairingApName = 'KadePairing'
kade.conf.ap.cmd = '--daemon -n --isolate-clients -m nat --hostapd-debug 2 --no-haveged -g 192.168.11.1 -c 1 --country US' // --hidden
kade.conf.ap.pairingCmd = kade.conf.ap.cmd
kade.conf.isVerb = kade.debug
