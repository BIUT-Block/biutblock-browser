const express = require('express')
const router = express.Router()
const request = require('request')

/* GET home page. */
const jsonrpc = '2.0'
const rpcid = 1

router.post('/callrpc', (req, res, next) => {
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
      res.json(err)
    }
    res.json(response)
  })
})

module.exports = router
