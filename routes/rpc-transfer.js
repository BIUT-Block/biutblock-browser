const express = require('express')
const router = express.Router()
const request = require('request')

const jsonrpc = '2.0'
const rpcid = 1
const rpcServer = 'http://localhost:3002'

router.post('/callrpc', (req, res, next) => {
  let bodyRequest = {
    'method': req.body.method,
    'jsonrpc': jsonrpc,
    'id': rpcid,
    'params': req.body.params
  }
  request({
    method: 'POST',
    url: rpcServer,
    body: JSON.stringify(bodyRequest),
    headers: {
      'Content-Type': 'application/json'
    }
  }, (err, response, body) => {
    if (err) {
      res.send(err)
    }
    res.send(response.body)
  })
})

module.exports = router
