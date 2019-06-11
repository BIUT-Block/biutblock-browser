const express = require('express')
const router = express.Router()
const request = require('request')

router.get('/', (req, res, next) => {
  request({
    method: 'GET',
    url: req.query.url,
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
