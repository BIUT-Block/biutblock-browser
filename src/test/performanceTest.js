const jayson = require('jayson')
const ip = require("ip")
const SECUtils = require('@sec-block/secjs-util')

// let client = jayson.client.http({
//   host: '35.158.171.46',
//   // host: '13.209.3.183',
//   // host: '35.180.32.134',
//   // host: '54.250.166.137',
//   port: 3002

// })
// let user1 = {
//   privKey:
//     'b9230d80d06821e4cadddad4111d8db3f7d74dc9e311b7aecd1eef35a9e78c2a',
//   publicKey:
//     'd6bbd927ce9e0795d1f291492c7101651a946cd9add9656620c2b426b316a1101e2e312ad2bea9c93b4a228ecdb1441456d5ac46433c081dfcd588946ec4945d',
//   secAddress: '83da24368d250db335b6085f1442aa15468a75d8'
// }

// let user2 = {
//   privKey:
//     '5539a27ac0565d7dc4b4b25c6cf55d407c1a87b2506c957e71094994e5d8e44b',
//   publicKey:
//     '7ec9096d326f0a82ef45d465c8fc53fd9e50753d759e7f50e0ea364dcf5d7e555935eefc6a13652533a79854fe43d9440f0b1aab2090f68487cf450feec3fb48',
//   secAddress: '032b0cb78bec8d0e7a34b6ee590a738225a3377e'
// }

// let address1 = [user1.secAddress]
// let address2 = [user2.secAddress]

// class performanceTest {
//   constructor (config = {}) {
//     this.config = config
//     // this.sec_getBalance()
//     // this.sec_sendRawTransaction()
//     // this.sec_getTransactions()
//     // this.sec_freeCharge()
//     // this.sec_getTokenChainSize()
//     // this.sec_setPOW()
//     // this.sec_startNetworkEvent()
//   }
//   sec_getBalance () {
//     const request = ['83da24368d250db335b6085f1442aa15468a75d8', 'latest']
//     console.time('getBalanceTime')
//     client.request('sec_getBalance', request, (err, response) => {
//       if (err) console.log(err)
//       console.log('sec_getBalance')
//       console.log(response)
//       console.timeEnd('getBalanceTime')
//     })
//   }

//   sec_getTransactions () {
//     const request = ['fa9461cc20fbb1b0937aa07ec6afc5e660fe2afd'] // account address
//     client.request('sec_getTransactions', request, (err, response) => {
//       if (err) console.log(err)
//       console.log('sec_getTransactions')
//       console.log(response)
//       console.log('result: ')
//       console.log(JSON.stringify(response.result))
//     })
//   }

//   sec_sendRawTransaction () {
//     const request = [{
//       timestamp: new Date().getTime(), // number
//       from: 'fa9461cc20fbb1b0937aa07ec6afc5e660fe2afd', // 40 bytes address
//       to: '8df9628de741b3d42c6f4a29ed4572b0f05fe8b4', // 40 bytes address
//       value: '110.5235', // string
//       gasLimit: '0', // string, temporarily set to 0
//       gas: '0', // string, temporarily set to 0
//       gasPrice: '0', // string, temporarily set to 0
//       inputData: 'Sec test transaction', // string, user defined extra messages
//       data: ''
//     }]

//     // get transaction signature
//     const tokenTxBuffer = [
//       SECUtils.bufferToInt(request[0].timestamp),
//       Buffer.from(request[0].from, 'hex'),
//       Buffer.from(request[0].to, 'hex'),
//       Buffer.from(request[0].value),
//       Buffer.from(request[0].gasLimit),
//       Buffer.from(request[0].gas),
//       Buffer.from(request[0].gasPrice),
//       Buffer.from(request[0].inputData)
//     ]

//     let txSigHash = Buffer.from(SECUtils.rlphash(tokenTxBuffer).toString('hex'), 'hex')
//     let signature = SECUtils.ecsign(txSigHash, Buffer.from(userInfo.privKey, 'hex'))
//     request[0].data = {
//       v: signature.v,
//       r: signature.r.toString('hex'),
//       s: signature.s.toString('hex')
//     }

//     // send the request
//     client.request('sec_sendRawTransaction', request, (err, response) => {
//       if (err) console.log(err)
//       console.log('sec_sendRawTransaction')
//       console.log(response)
//     })
//   }

//   sec_freeCharge () {
//     const request = [{
//       to: 'fa9461cc20fbb1b0937aa07ec6afc5e660fe2afd',
//       value: '100000000'
//     }]
//     client.request('sec_freeCharge', request, (err, response) => {
//       if (err) console.log(err)
//       console.log('sec_freeCharge')
//       console.log(response)
//     })
//   }

//   sec_getTokenChainSize () {
//     const request = []
//     client.request('sec_getTokenChainSize', request, (err, response) => {
//       if (err) console.log(err)
//       console.log('sec_getTokenChainSize')
//       console.log(response)
//     })
//   }
// }

// let performanceTest = new performanceTest()

// -------------------------------------------------------------------------------------------------- //
// ------------------------------------  test get balance time  ------------------------------------ //
// -------------------------------------------------------------------------------------------------- //

// console.time('GetBalance')
// client.request('sec_getBalance', address1, (err, response) => {
//   if (err) console.log(err)
//   console.log('sec_getBalance')
//   console.log(response)
//   console.timeEnd('GetBalance')
// })

// -------------------------------------------------------------------------------------------------- //
// ------------------------------------  test transcation time  ------------------------------------ //
// -------------------------------------------------------------------------------------------------- //

// console.time('Tx')
// function _findTx () {
//   client.request('sec_getTransactions', address1, (err, response) => {
//     if (err) {
//       return err
//     } else {
//       let transaction = response.result.resultInChain

//       transaction.forEach((tx) => {
//         if (tx.TxReceiptStatus === 'Success') {
//           console.timeEnd('Tx')
//         } else {
//           _findTx()
//         }
//       })
//     }
//   })
// }
// _findTx()

// -------------------------------------------------------------------------------------------------- //
// ------------------------------------  pressure test  ------------------------------------ //
// -------------------------------------------------------------------------------------------------- //

let ipList = [
  '35.158.171.46',
  '54.250.166.137',
  '35.180.32.134',
  '13.209.3.183',
  '13.209.77.5',
  '35.180.63.62',
  '35.177.62.42',
  '52.221.195.12',
  '18.203.81.15',
  '54.153.12.8',
  '54.208.221.197',
  '13.238.159.210',
  '54.233.151.90',
  '35.182.132.252',
  '13.230.242.85',
  '13.230.10.37',
  '13.124.250.204',
  '35.180.97.48',
  '52.29.47.99',
  '34.213.27.238',
  '52.66.249.199',
  '18.136.204.121',
  '52.15.229.1'
]

let myIp = ip.address()
let index = ipList.indexOf(myIp)
let nextIp = ''
if (index === -1) {
  nextIp = myIp
} else if (index < ipList.length - 1) {
  nextIp = ipList[index + 1]
} else {
  nextIp = ipList[0]
}


let client1 = jayson.client.http({
  host: myIp,
  port: 3002
})

const interval = 100

function sendTx1 () {
  const userInfo = {
    privKey: 'e976359381e71614f783edd3f4d9046639c022edce478101c8a5e3332cdefd43',
    publicKey: '09a9b34222358e38b37fd1cded2e4b2618057be3f29d2b2a4897318a808a77554facb0f3e0609328aa0fd396c58879c52db7f2f192824f841bbb9f5cdd64fa8d',
    secAddress: 'fa9461cc20fbb1b0937aa07ec6afc5e660fe2afd'
  }
  const request = [{
    timestamp: new Date().getTime(), // number
    from: 'fa9461cc20fbb1b0937aa07ec6afc5e660fe2afd', // 40 bytes address
    to: '8df9628de741b3d42c6f4a29ed4572b0f05fe8b4', // 40 bytes address
    value: '1', // string
    gasLimit: '0', // string, temporarily set to 0
    gas: '0', // string, temporarily set to 0
    gasPrice: '0', // string, temporarily set to 0
    inputData: 'Sec test transaction', // string, user defined extra messages
    data: ''
  }]
  const tokenTxBuffer = [
    SECUtils.bufferToInt(request[0].timestamp),
    Buffer.from(request[0].from, 'hex'),
    Buffer.from(request[0].to, 'hex'),
    Buffer.from(request[0].value),
    Buffer.from(request[0].gasLimit),
    Buffer.from(request[0].gas),
    Buffer.from(request[0].gasPrice),
    Buffer.from(request[0].inputData)
  ]
  let txSigHash = Buffer.from(SECUtils.rlphash(tokenTxBuffer).toString('hex'), 'hex')
  let signature = SECUtils.ecsign(txSigHash, Buffer.from(userInfo.privKey, 'hex'))
  request[0].data = {
    v: signature.v,
    r: signature.r.toString('hex'),
    s: signature.s.toString('hex')
  }
  client1.request('sec_sendRawTransaction', request, (err, response) => {
    if (err) console.log(err)
    console.log('Frankfurt:')
    console.log(response)
  })
}

let stop = setInterval(sendTx1, interval)

setTimeout(() => { clearInterval(stop) }, 5 * 60 * 1000)
