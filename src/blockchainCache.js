const SECCore = require('./main').Core
const deepcopy = require('clone-deep')
const _ = require('lodash')

class BlockchainCache {
  constructor () {
    this.biutChain = []
    this.biuChain = []
    this.biutChainHeight = 0
    this.biuChainHeight = 0
    this.biutTxs = []
    this.biuTxs = []
    this.biutHome = {}
    this.biuHome = {}
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
      this.loadBIUTChainHeight()
    }, 60000)
    setInterval(() => {
      this.loadBIUChain(err => {
        if (err) console.error(err)
      })
      this.loadBIUChainHeight()
    }, 60000)
  }

  loadBIUTChain (callback) {
    SECCore.secAPIs.getWholeTokenBlockchain((err, data) => {
      this.biutChain = data
      this.biutChainHeight = this.biutChain.length
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
            this.biutHome = {
              BlockSum: this.biutChain.length,
              blockchain: _.takeRight(deepcopy(this.biutChain), 20).reverse(),
              TransactionsSum: this.biutTxs.length,
              BIUTTxs: _.takeRight(deepcopy(this.biutTxs), 20).reverse()
            }
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
      this.biuChainHeight = this.biuChain.length
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
            this.biuHome = {
              BlockSum: this.biuChain.length,
              blockchain: _.takeRight(deepcopy(this.biuChain), 20).reverse(),
              TransactionsSum: this.biuTxs.length,
              BIUTxs: (_.takeRight(deepcopy(this.biuTxs), 20).reverse()).filter(tx => {
                return tx.TxFrom.substring(0, 4) !== '0000' && tx.TxTo.substring(0, 4) !== '0000'
              }),
              accountNumber: Math.round(this.biuTxs.length / 2 * 3)
            }
            callback(err)
          }
        })
      } catch (err) {
        callback(err)
      }
    })
  }

  loadBIUTChainHeight (callback) {
    this.biutChainHeight = SECCore.secAPIs.getChainHeight()
  }

  loadBIUChainHeight (callback) {
    this.biuChainHeight = SECCore.secAPIs.getChainHeight()
  }

  getBIUTChain () {
    return deepcopy(this.biutChain)
  }

  getBIUChain () {
    return deepcopy(this.biuChain)
  }

  getBIUTChainHeight () {
    return this.biutChainHeight
  }

  getBIUChainHeight () {
    return this.biuChainHeight
  }

  getBIUTTxs () {
    return deepcopy(this.biutTxs)
  }
  getBIUTxs () {
    return deepcopy(this.biuTxs)
  }
  getBIUTHomeInfo () {
    return this.biutHome
  }
  getBIUHomeInfo () {
    return this.biuHome
  }
}

let blockchainCache = new BlockchainCache()

module.exports = blockchainCache
