const express = require('express')
const router = express.Router()
const SECCore = require('../src/main').Core
const BlockchainCache = require('../src/blockchainCache')

router.get('/genesisBlockHash', function (req, res, next) {
  res.send(BlockchainCache.getBIUChain()[0].Hash)
})

router.get('/tokenblockchain', function (req, res, next) {
  let pageNumber = parseInt(req.query.pageNumber || 1)
  let pageSize = parseInt(req.query.pageSize || 39)
  let data = BlockchainCache.getBIUChain()
  let totalNumber = data.length
  let blockchain = data.reverse().slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
  res.render('sen/tokenblockchain', {
    page: 'sen-tokenblockchain',
    title: 'BIU Blockchain - Token Blockchain',
    pageNumber: pageNumber,
    totalNumber: totalNumber,
    blockchain: blockchain
  })
})

router.get('/tokenblockchain-pagination', function (req, res, next) {
  let pageNumber = parseInt(req.query.pageNumber || 1)
  let pageSize = parseInt(req.query.pageSize || 39)
  let data = BlockchainCache.getBIUChain()
  let blockchain = data.reverse().slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
  res.json(blockchain)
})

router.get('/tokenblockdetails', function (req, res, next) {
  let data = BlockchainCache.getBIUChain()
  data.forEach(_block => {
    if (_block.Hash === req.query.hash) {
      res.render('sen/tokenblockdetails', {
        page: 'sen-tokenblockdetails',
        title: 'BIU Blockchain - Token Block Details',
        block: _block
      })
    }
  })
})

router.get('/tokenblockdetailsbynumber', function (req, res, next) {
  let block = BlockchainCache.getBIUChain()[parseInt(req.query.number)]
  if (typeof block.Transactions !== 'object') {
    block = JSON.parse(block)
  }
  res.render('sen/tokenblockdetails', {
    page: 'sen-tokenblockdetails',
    title: 'BIU Blockchain - Token Block Details',
    block: block
  })
})

router.get('/tokentxlist', function (req, res, next) {
  let pageNumber = parseInt(req.query.pageNumber || 1)
  let pageSize = parseInt(req.query.pageSize || 39)
  let data = BlockchainCache.getBIUChain()
  let transactions = []
  data.reverse().forEach(block => {
    let _transactions = block.Transactions.map(el => {
      let _transaction = Object.assign({}, el)
      _transaction.BlockNumber = block.Number
      _transaction.BlockTimeStamp = block.TimeStamp
      return _transaction
    })
    transactions = transactions.concat(_transactions)
  })
  let totalNumber = transactions.length
  let _transactions = transactions.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
  res.render('sen/tokentxlist', {
    page: 'sen-tokentxlist',
    title: 'BIU Blockchain - Token Tx List',
    pageNumber: pageNumber,
    totalNumber: totalNumber,
    transactions: _transactions
  })
})

router.get('/tokentxlist-pagination', function (req, res, next) {
  let pageNumber = parseInt(req.query.pageNumber || 1)
  let pageSize = parseInt(req.query.pageSize || 39)
  let data = BlockchainCache.getBIUChain()
  let transactions = []
  data.reverse().forEach(block => {
    let _transactions = block.Transactions.map(el => {
      let _transaction = Object.assign({}, el)
      _transaction.BlockNumber = block.Number
      _transaction.BlockTimeStamp = block.TimeStamp
      return _transaction
    })
    transactions = transactions.concat(_transactions)
  })
  let _transactions = transactions.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
  res.json(_transactions)
})

router.get('/tokentxdetails', function (req, res, next) {
  let BIUTxs = BlockchainCache.getBIUTxs()
  BIUTxs.forEach(tx => {
    if (req.query.hash === tx.TxHash) {
      res.render('sen/tokentxdetails', {
        page: 'sen-tokentxdetails',
        title: 'BIU Blockchain - Token Tx Details',
        transaction: tx
      })
    }
  })
})

router.get('/accountdetails', function (req, res, next) {
  let address = req.query.address || ''
  SECCore.senAPIs.getTokenTxForUser(address, (err, txArray) => {
    if (err) next(err)
    let income = 0
    let spend = 0
    txArray.forEach(tx => {
      if (tx.TxFrom === address) {
        spend++
      }
      if (tx.TxTo === address) {
        income++
      }
    })
    SECCore.senAPIs.getBalance(address, 'SEN', (err, balance) => {
      if (err) next(err)
      res.render('sen/accountdetails', {
        page: 'sen-accountdetails',
        title: 'BIU Blockchain Account Details',
        address: address,
        txArray: txArray,
        balance: balance,
        income: income,
        spend: spend
      })
    })
  })
})

router.get('/search', function (req, res, next) {
  let keyword = req.query.search.replace(/\s/g, '')
  keyword = keyword.substring(0, 2) === '0x' ? keyword.substring(2) : keyword
  if (isNaN(keyword)) {
    if (keyword.length === 64) {
      SECCore.senAPIs.getTokenBlock(keyword, (err, block) => {
        if (!err) {
          if (typeof block.Transactions !== 'object') {
            block = JSON.parse(block)
          }
          res.render('sen/tokenblockdetails', {
            page: 'sen-tokenblockdetails',
            title: 'BIU Blockchain - Token Block Details',
            block: block
          })
        } else {
          SECCore.senAPIs.getTokenTx(keyword, transaction => {
            if (transaction) {
              res.render('sen/tokentxdetails', {
                page: 'sen-tokentxdetails',
                title: 'BIU Blockchain - Token Tx Details',
                transaction: transaction
              })
            } else {
              return next(new Error('Wrong Input Block Hash or Tx Hash'))
            }
          })
        }
      })
    } else if (keyword.length === 40) {
      SECCore.senAPIs.getTokenTxForUser(keyword, (err, txArray) => {
        if (err) next(err)
        if (txArray.length === 0) {
          return next(new Error('Wrong User Address'))
        }
        let income = 0
        let spend = 0
        txArray.forEach(tx => {
          if (tx.TxFrom === keyword) {
            spend++
          }
          if (tx.TxTo === keyword) {
            income++
          }
        })
        SECCore.senAPIs.getBalance(keyword, 'SEN', (err, balance) => {
          if (err) next(err)
          res.render('sen/accountdetails', {
            page: 'sen-accountdetails',
            title: 'BIU Blockchain Account Details',
            address: keyword,
            txArray: txArray,
            balance: balance,
            income: income,
            spend: spend
          })
        })
      })
    } else {
      return next(new Error('Wrong Input parameter'))
    }
  } else {
    SECCore.senAPIs.getWholeTokenBlockchain((err, data) => {
      if (err) next(err)
      if ((parseInt(keyword) < data.length) && (parseInt(keyword) > -1)) {
        let block = data[parseInt(keyword)]
        if (typeof block.Transactions !== 'object') {
          block = JSON.parse(block)
        }
        res.render('sen/tokenblockdetails', {
          page: 'sen-tokenblockdetails',
          title: 'BIU Blockchain - Token Block Details',
          block: block
        })
      } else {
        return next(new Error('Block Height Error'))
      }
    })
  }
})

module.exports = router
