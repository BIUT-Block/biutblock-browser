const express = require('express')
const router = express.Router()
const request = require('request')

router.get('/ticker', (req, res, next) => {
  if (req.query.symbol === 'sec_btc') {
    request({
      method: 'GET',
      url: 'https://trade.coinegg.com/web/symbol/ticker?right_coin=btc',
      headers: {
        'Content-Type': 'application/json'
      }
    }, (err, response, body) => {
      if (err) {
        res.json(err)
      }
      let data = typeof response.body === 'string' ? JSON.parse(response.body) : response.body
      res.json(data)
    })
  } else if (req.query.symbol === 'sec_eth') {
    request({
      method: 'GET',
      url: 'https://trade.coinegg.com/web/symbol/ticker?right_coin=eth',
      headers: {
        'Content-Type': 'application/json'
      }
    }, (err, response, body) => {
      if (err) {
        res.json(err)
      }
      let data = typeof response.body === 'string' ? JSON.parse(response.body) : response.body
      res.json(data)
    })
  } else if (req.query.symbol === 'eth_usdt') {
    request({
      method: 'GET',
      url: 'https://market.coinegg.com/market/ticker?symbol=eth_usdt',
      headers: {
        'Content-Type': 'application/json'
      }
    }, (err, response, body) => {
      if (err) {
        res.json(err)
      }
      let data = typeof response.body === 'string' ? JSON.parse(response.body) : response.body
      res.json(data)
    })
  }

  
})

router.get('/kline', (req, res, next) => {
  request({
    method: 'GET',
    url: 'https://api.coinegg.im/api/v1/kline/region/eth?coin=sec',
    headers: {
      'Content-Type': 'application/json'
    }
  }, (err, response, body) => {
    if (err) {
      res.json(err)
    }
    let data = typeof response.body === 'string' ? JSON.parse(response.body) : response.body
    res.json(data)
  })
})
module.exports = router
