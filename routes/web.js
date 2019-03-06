const express = require('express')
const router = express.Router()
const SECCore = require('../src/main').secCore
const fs = require('fs')
const request = require('request')
const GEOIPReader = require('@maxmind/geoip2-node').Reader
const dbBuffer = fs.readFileSync(process.cwd() + '/src/GeoIP2-City.mmdb')
const geoIPReader = GEOIPReader.openBuffer(dbBuffer)

/* GET home page. */
const jsonrpc = '2.0'
const rpcid = 1

router.post('/rpcfreecharge', (req, res, next) => {
  console.log(req.body)
  let method = 'sec_freeCharge'
  let params = req.params
  let bodyRequest = {
    'method': method,
    'jsonrpc': jsonrpc,
    'id': rpcid,
    'params': params
  }
  request({
    method: 'POST',
    url: 'http://localhost:3002',
    body: JSON.stringify(bodyRequest),
    headers: {
      'Content-Type': 'application/json'
    }
  }, (err, response, body) => {
    if (err) {
      res.send(err)
    }
    res.send(response)
  })
})

module.exports = router
