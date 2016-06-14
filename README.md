# kade Server
Known Array of Decentralised Elements !

### Todo

 * RPC
   * Rudimentary API available. Functionality will come with future dev
   * No tls, as no cert on 127.0.0.1/192.168.0.x/raspi.local possible. E2EE with pre shared         key, even for RPC.

 * Start working on a web gui > KISS
  * basic setup listing devices, switch to pairing mode
  * controls on what's available (status...)
  * dev mode, manually add device, access to AP WPA

* Phone app
  * Access to controls on what's available (status...)
  * Connect to pairing AP, scans QR, finishes up pairing

 * Setup new devices mode
  * finish testing up node-createap
  * Make pairing mode working properly
    * device should full reboot if cant set interface in proper mode (happens)
    * Check node-reboot


### Wifi
 * make create_ap wrapper for temp'd reboot mode

### RPC
  * Todo : cert pinning & HTTPS
  * Todo : Auth

```

Request | Path                     |   Definition  
--------------------------------------------------------------------------------
GET     | reboot/pairing           |   Reboot in pairing mode
        |                          |
GET     | sensor                   |   all items
GET     | sensor/oven              |   item(s) details
GET     | sensor/oven/temp         |   prop value
        |                          |
PUT     |  sensor/oven/temp/180    |   update value                
PUT     |  sensors?                |   update value
        |    name=oven&value=off   |    
        |                          |
POST    |  sensors?                |   create new sensor (only compulsory: name)
        |    name=oven&value=off   |
```
