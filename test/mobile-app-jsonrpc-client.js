const jayson = require('jayson')
const SECUtils = require('@sec-block/secjs-util')

/**
 * rpc server port 3002
 */
let client = jayson.client.http({
  // host: '18.197.120.79', // test-frankfurt
  host: '35.180.100.27', // test-paris
  port: 3002
})

const userInfo = {
  privKey: 'b9230d80d06821e4cadddad4111d8db3f7d74dc9e311b7aecd1eef35a9e78c2a',
  publicKey: 'd6bbd927ce9e0795d1f291492c7101651a946cd9add9656620c2b426b316a1101e2e312ad2bea9c93b4a228ecdb1441456d5ac46433c081dfcd588946ec4945d',
  secAddress: '83da24368d250db335b6085f1442aa15468a75d8'
}

class MobileAppRpcClient {
  constructor (config = {}) {
    this.config = config
    // this.sec_getBalance()
    // this.sec_getTransactions()
    // this.sec_sendRawTransaction()
    // this.sec_freeCharge()
    // this.sec_getTokenChainSize()
    // this.sec_setPOW()
    // this.sec_startNetworkEvent()
    // this.sec_getBlockByHash()
    // this.sec_getWholeTokenBlockchain()
    // this.sec_setAddress()
    // this.sec_clearCache()
    // this.sec_getChainHeight()
    // this.sec_getNodeInfo()
    // this._setBlock()
    // this._syncFromIp()
    // this.sec_debug_getAccTreeAccInfo()
    this.sec_getTotalReward()
  }

  sec_getTotalReward () {
    const request = []
    client.request('sec_getTotalReward', request, (err, response) => {
      if (err) console.log(err)
      console.log('sec_getTotalReward')
      console.log(JSON.stringify(response))
    })
  }

  sec_debug_getAccTreeAccInfo () {
    let request = ['83da24368d250db335b6085f1442aa15468a75d8']
    client.request('sec_debug_getAccTreeAccInfo', request, (err, response) => {
      if (err) console.log(err)
      console.log('sec_debug_getAccTreeAccInfo')
      console.log(JSON.stringify(response))
    })
  }

  sec_getNodeInfo () {
    const request = []
    client.request('sec_getNodeInfo', request, (err, response) => {
      if (err) console.log(err)
      console.log('sec_getNodeInfo')
      console.log(JSON.stringify(response))
    })
  }

  sec_getChainHeight () {
    const request = []
    client.request('sec_getChainHeight', request, (err, response) => {
      if (err) console.log(err)
      console.log('sec_getChainHeight')
      console.log(response)
    })
  }

  sec_getBalance () {
    const request = ['83da24368d250db335b6085f1442aa15468a75d8', 'latest'] // account address
    client.request('sec_getBalance', request, (err, response) => {
      if (err) console.log(err)
      console.log('sec_getBalance')
      console.log(response)
    })
  }

  sec_getTransactions () {
    const request = ['83da24368d250db335b6085f1442aa15468a75d8'] // account address
    client.request('sec_getTransactions', request, (err, response) => {
      if (err) console.log(err)
      console.log('sec_getTransactions')
      console.log(response)
      console.log('result: ')
      console.log(JSON.stringify(response.result))
    })
  }

  sec_sendRawTransaction () {
    const request = [{
      timestamp: new Date().getTime(), // number
      from: '83da24368d250db335b6085f1442aa15468a75d8', // 40 bytes address
      to: '7ad81e8ab64ddc52cd91b1ca921ab4baf1cf8f6b', // 40 bytes address
      value: '10', // string
      gasLimit: '0', // string, temporarily set to 0
      gas: '0', // string, temporarily set to 0
      gasPrice: '0', // string, temporarily set to 0
      txFee: '1',
      inputData: 'Sec test transaction', // string, user defined extra messages
      data: ''
    }]

    // get transaction signature
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

    // send the request
    client.request('sec_sendRawTransaction', request, (err, response) => {
      if (err) console.log(err)
      console.log('sec_sendRawTransaction')
      console.log(response)
    })
  }

  sec_freeCharge () {
    const request = [{
      to: '83da24368d250db335b6085f1442aa15468a75d8',
      value: '1000'
    }]
    client.request('sec_freeCharge', request, (err, response) => {
      if (err) console.log(err)
      console.log('sec_freeCharge')
      console.log(response)
    })
  }

  sec_getTokenChainSize () {
    const request = []
    client.request('sec_getTokenChainSize', request, (err, response) => {
      if (err) console.log(err)
      console.log('sec_getTokenChainSize')
      console.log(response)
    })
  }

  sec_setPOW () {
    const request = ['0']
    client.request('sec_setPOW', request, (err, response) => {
      if (err) console.log(err)
      console.log('sec_setPOW')
      console.log(response)
    })
  }

  sec_startNetworkEvent () {
    const request = []
    client.request('sec_startNetworkEvent', request, (err, response) => {
      if (err) console.log(err)
      console.log('sec_startNetworkEvent')
      console.log(response)
    })
  }

  sec_getBlockByHash () {
    const request = ['eef602646df8cbdbe4df69a4ab3e230a5abcabbbda3464e886b5288b7f1e3d22']
    client.request('sec_getBlockByHash', request, (err, response) => {
      if (err) console.log(err)
      console.log('sec_getBlockByHash')
      console.log(response)
    })
  }

  sec_getWholeTokenBlockchain () {
    let request = {}
    client.request('sec_getWholeTokenBlockchain', request, (err, response) => {
      if (err) console.log(err)
      console.log('sec_getWholeTokenBlockchain')
      console.log(response)
    })
  }

  sec_setAddress () {
    let request = ['1000000000100000000010000000001000000000']
    client.request('sec_setAddress', request, (err, response) => {
      if (err) console.log(err)
      console.log('sec_setAddress')
      console.log(response)
    })
  }

  _setBlock () {
    let request = [{
      Number: 1,
      Hash: '1234',
      ReceiptRoot: '11',
      LogsBloom: '11',
      MixHash: '11',
      StateRoot: '11',
      TimeStamp: 1537900000,
      ParentHash: '11',
      Beneficiary: '11',
      Difficulty: '1',
      ExtraData: 'rpc test',
      Nonce: SECUtils.zeros(8).toString('hex'),
      Transactions: []
    }]
    client.request('_setBlock', request, (err, response) => {
      if (err) console.log(err)
      console.log('_setBlock')
      console.log(response)
    })
  }

  _syncFromIp () {
    let request = [{}]
    request[0].ip = '35.180.100.27'
    console.log(request)
    client.request('_syncFromIp', request, (err, response) => {
      if (err) console.log(err)
      console.log('_syncFromIp')
      console.log(response)
    })
  }
}

let mobileAppRpcClient = new MobileAppRpcClient()
