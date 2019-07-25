const request = require('request')

request({
  method: 'POST',
  url: 'http://localhost:3002',
  body: JSON.stringify({
    'method': 'sec_getNonce',
    'jsonrpc': '2.0',
    'id': '1',
    'params': ['c4be3c8093fd7acdcdf415331040fc974f8b2ad5']
  }),
  headers: {
    'Content-Type': 'application/json'
  }
}, (err, response, body) => {
  if (err) console.log(err)
  let data = typeof response.body === 'string' ? JSON.parse(response.body) : response.body
  let nonce = data.result ? data.result.Nonce || '0' : '0'
  console.log(nonce)
})
