const jayson = require('jayson')
const SECUtils = require('@biut-block/biutjs-util')

/**
 * rpc server port 3002
 */
let client = jayson.client.http({
  // host: '35.158.171.46', // test-frankfurt
  // host: '35.180.100.27', // test-paris
  // host:'127.0.0.1',
  // port: 3003
  host: 'localhost',
  port: 3004
})

const userInfo = {
  privKey: 'b9230d80d06821e4cadddad4111d8db3f7d74dc9e311b7aecd1eef35a9e78c2a',
  publicKey: 'd6bbd927ce9e0795d1f291492c7101651a946cd9add9656620c2b426b316a1101e2e312ad2bea9c93b4a228ecdb1441456d5ac46433c081dfcd588946ec4945d',
  secAddress: '83da24368d250db335b6085f1442aa15468a75d8'
}

class MobileAppRpcClient {
  constructor (config = {}) {
    this.config = config
    this.biut_getBalance()
    // this.biut_getTransactions()
    // this.biut_sendRawTransaction()
    // this.biut_freeCharge()
    // this.biut_getTokenChainSize()
    // this.biut_setPOW()
    // this.biut_startNetworkEvent()
    // this.biut_getBlockByHash()
    // this.biut_getWholeTokenBlockchain()
    this.biut_getNewAddress()
    // this.biut_clearCache()
    // this.biut_getChainHeight()
    // this.biut_getNodeInfo()
    // this._setBlock()
    // this._syncFromIp()
    // this.biut_debug_getAccTreeAccInfo()
    // this.biut_getTotalReward()
    this.biut_rebuildAccTree()
    // this.biut_validateAddress()
  }

  biut_rebuildAccTree () {
    const request = []
    client.request('biut_rebuildAccTree', request, (err, response) => {
      if (err) console.log(err)
      console.log('biut_rebuildAccTree')
      console.log(JSON.stringify(response))
    })
  }

  biut_debug_getAccTreeAccInfo () {
    let request = ['83da24368d250db335b6085f1442aa15468a75d8']
    client.request('biut_debug_getAccTreeAccInfo', request, (err, response) => {
      if (err) console.log(err)
      console.log('biut_debug_getAccTreeAccInfo')
      console.log(JSON.stringify(response))
    })
  }

  biut_getNodeInfo () {
    const request = []
    client.request('biut_getNodeInfo', request, (err, response) => {
      if (err) console.log(err)
      console.log('biut_getNodeInfo')
      console.log(JSON.stringify(response))
    })
  }

  biut_getChainHeight () {
    const request = []
    client.request('biut_getChainHeight', request, (err, response) => {
      if (err) console.log(err)
      console.log('biut_getChainHeight')
      console.log(response)
    })
  }

  biut_getBalance () {
    const request = ['83da24368d250db335b6085f1442aa15468a75d8', 'latest'] // account address
    client.request('biut_getBalance', request, (err, response) => {
      if (err) console.log(err)
      console.log('biut_getBalance')
      console.log(response)
    })
  }

  biut_getTransactions () {
    // const request = ['0xe71250bbd106fdcf7c7a92cf7d58d8680976d20e'] // account address
    const request = ['0xe71250bbd106fdcf7c7a92cf7d58d8680976d20e', 2, 5] // account address
    client.request('biut_getTransactions', request, (err, response) => {
      if (err) console.log(err)
      console.log('biut_getTransactions')
      console.log(response)
      console.log('result: ')
      console.log(JSON.stringify(response.result))
    })
  }

  biut_sendRawTransaction () {
    const request = [{
      timestamp: new Date().getTime(), // number
      from: '0xe71250bbd106fdcf7c7a92cf7d58d8680976d20e', // 40 bytes address
      to: '7ad81e8ab64ddc52cd91b1ca921ab4baf1cf8f6b', // 40 bytes address
      value: '0.01', // string
      gasLimit: '0', // string, temporarily set to 0
      gas: '0', // string, temporarily set to 0
      gasPrice: '0', // string, temporarily set to 0
      txFee: '1',
      inputData: 'BIUT test transaction', // string, user defined extra messages
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
    let signature = SECUtils.ecsign(txSigHash, Buffer.from(userInfo.secAddress, 'hex'))
    request[0].data = {
      v: signature.v,
      r: signature.r.toString('hex'),
      s: signature.s.toString('hex')
    }

    // send the request
    client.request('biut_sendRawTransaction', request, (err, response) => {
      if (err) console.log(err)
      console.log('biut_sendRawTransaction')
      console.log(response)
    })
  }

  biut_freeCharge () {
    const request = [{
      to: '83da24368d250db335b6085f1442aa15468a75d8',
      value: '1000'
    }]
    client.request('biut_freeCharge', request, (err, response) => {
      if (err) console.log(err)
      console.log('biut_freeCharge')
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

  biut_startNetworkEvent () {
    const request = []
    client.request('biut_startNetworkEvent', request, (err, response) => {
      if (err) console.log(err)
      console.log('biut_startNetworkEvent')
      console.log(response)
    })
  }

  biut_getBlockByHash () {
    const request = ['eef602646df8cbdbe4df69a4ab3e230a5abcabbbda3464e886b5288b7f1e3d22']
    client.request('biut_getBlockByHash', request, (err, response) => {
      if (err) console.log(err)
      console.log('biut_getBlockByHash')
      console.log(response)
    })
  }

  biut_getWholeTokenBlockchain () {
    let request = {}
    client.request('biut_getWholeTokenBlockchain', request, (err, response) => {
      if (err) console.log(err)
      console.log('biut_getWholeTokenBlockchain')
      console.log(response)
    })
  }

  biut_setAddress () {
    let request = ['1000000000100000000010000000001000000000']
    client.request('biut_setAddress', request, (err, response) => {
      if (err) console.log(err)
      console.log('biut_setAddress')
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

  biut_validateAddress () {
    let request = ['83da24368d250db335b6085f1442aa15468a75d8']
    client.request('biut_validateAddress', request, (err, response) => {
      if (err) console.log(err)
      console.log('biut_validateAddress')
      console.log(response)
    })
  }

  biut_getNewAddress () {
    let request = []
    client.request('biut_getNewAddress', request, (err, response) => {
      if (err) console.log(err)
      console.log('biut_getNewAddress')
      console.log(response)
    })
  }
}

let mobileAppRpcClient = new MobileAppRpcClient()
