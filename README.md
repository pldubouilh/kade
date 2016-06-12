# kade Server
Known Array of Decentralised Elements !

### Todo
 * RPC
   * Rudimentary API available. Functionality will come with future dev
 * Start working on a web gui
 * Setup new devices mode

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
