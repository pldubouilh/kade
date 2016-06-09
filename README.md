# kade Server
Known Array of Decentralised Elements !

### Todo
 * RPC
   * Rudimentary API available. Functionality will come with future dev
 * Start working on a web gui
 * Setup new devices mode


### RPC

  * Todo : cert pinning & HTTPS
  * Provide

```
GET  sensor                            all items
GET  sensor/oven                       item(s) details
GET  sensor/oven/temp                  prop value

PUT  sensor/oven/temp/180              update value                

POST sensors?                          create new sensor (name only compulsory tag)
    name=oven&uuid=1234&value=off            
```
