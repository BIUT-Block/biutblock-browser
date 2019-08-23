const express = require('express')
const router = express.Router()
const request = require('request')

function getTimeInterval () {
  let fullYear = new Date().getFullYear()
  let month = new Date().getMonth() + 1
  let day = new Date().getDate()
  let timeStamp = new Date(fullYear + '-' + month + '-' + day + ' 18:00:00+08').getTime() / 1000
  let days10Before = timeStamp - 10 * 24 * 60 * 60
  return {
    current: timeStamp,
    days10Before: days10Before
  }
}

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
  } else if (req.query.symbol === 'sec_usdt') {
    request({
      method: 'GET',
      url: 'https://market.coinegg.com/market/ticker?symbol=sec_usdt',
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

router.get('/history', (req, res, next) => {
  let symbol = req.query.symbol
  let timeInterval = getTimeInterval()
  let url = 'https://market.coinegg.com/tradingview/history?symbol=' + symbol + '&resolution=D&from=' + timeInterval.days10Before + '&to=' + timeInterval.current
  request({
    method: 'GET',
    url: url,
    headers: {
      'Content-Type': 'application/json'
    }
  }, (err, response, body) => {
    if (err) {
      res.json(err)
    }
    try {
      let data = typeof response.body === 'string' ? JSON.parse(response.body) : response.body
      res.json(data)
    } catch (err) {
      res.json({})
    }
  })
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
