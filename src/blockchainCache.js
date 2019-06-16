const SECCore = require('./main').Core
const deepcopy = require('clone-deep')

class BlockchainCache {
  constructor () {
    this.biutChain = []
    this.biuChain = []
    this.biutTxs = []
    this.biuTxs = []
    this.loadBIUTChain(err => {
      if (err) console.error(err)
      else console.log('Init BIUTChain finished')
    })
    this.loadBIUChain(err => {
      if (err) console.error(err)
      else console.log('Init BIUChain finished')
    })
    this.run()
  }

  run () {
    setInterval(() => {
      this.loadBIUTChain(err => {
        if (err) console.error(err)
      })
    }, 20000)
    setInterval(() => {
      this.loadBIUChain(err => {
        if (err) console.error(err)
      })
    }, 20000)
  }

  loadBIUTChain (callback) {
    SECCore.secAPIs.getWholeTokenBlockchain((err, data) => {
      this.biutChain = data
      try {
        let biutTxs = []
        if (data.length === 0) return callback()
        data.forEach((_data, i) => {
          if (typeof _data.Transactions !== 'object') {
            _data.Transactions = JSON.parse(_data.Transactions)
          }
          biutTxs = biutTxs.concat(_data.Transactions)
          if (data.length === i + 1) {
            this.biutTxs = biutTxs
            callback(err)
          }
        })
      } catch (err) {
        callback(err)
      }
    })
  }

  loadBIUChain (callback) {
    SECCore.senAPIs.getWholeTokenBlockchain((err, data) => {
      if (err) console.error(err)
      this.biuChain = data
      try {
        let biuTxs = []
        if (data.length === 0) return callback()
        data.forEach((_data, i) => {
          if (typeof _data.Transactions !== 'object') {
            _data.Transactions = JSON.parse(_data.Transactions)
          }
          biuTxs = biuTxs.concat(_data.Transactions)
          if (data.length === i + 1) {
            this.biuTxs = biuTxs
            callback(err)
          }
        })
      } catch (err) {
        callback(err)
      }
    })
  }

  getBIUTChain () {
    return deepcopy(this.biutChain)
  }

  getBIUChain () {
    return deepcopy(this.biuChain)
  }

  getBIUTTxs () {
    return deepcopy(this.biutTxs)
  }
  getBIUTxs () {
    return deepcopy(this.biuTxs)
  }
}

let blockchainCache = new BlockchainCache()

module.exports = blockchainCache
