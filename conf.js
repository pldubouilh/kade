var kade = require('./main.js')
var jf = require('jsonfile')

kade.conf = {}
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
