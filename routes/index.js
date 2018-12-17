const express = require('express')
const router = express.Router()
const SECCore = require('../src/main').secCore
const iplocation = require('iplocation').default

/* GET home page. */

router.get('/', function (req, res, next) {
  res.render('index', { page: 'home', title: 'SEC Blockchain Explorer V1.1' })
})

router.get('/tokenblockchain', function (req, res, next) {
  let pageNumber = parseInt(req.query.pageNumber || 1)
  let pageSize = parseInt(req.query.pageSize || 50)
  SECCore.APIs.getWholeTokenBlockchain((err, data) => {
    if (err) next(err)
    let totalNumber = data.length
    let blockchain = data.reverse().slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
    res.render('tokenblockchain', {
      page: 'tokenblockchain',
      title: 'SEC Blockchain - Token Blockchain',
      pageNumber: pageNumber,
      totalNumber: totalNumber,
      blockchain: blockchain
    })
  })
})

router.get('/tokenblockchain-pagination', function (req, res, next) {
  let pageNumber = parseInt(req.query.pageNumber || 1)
  let pageSize = parseInt(req.query.pageSize || 50)
  SECCore.APIs.getWholeTokenBlockchain((err, data) => {
    if (err) next(err)
    let blockchain = data.reverse().slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
    res.json(blockchain)
  })
})

router.get('/tokenblockdetails', function (req, res, next) {
  SECCore.APIs.getTokenBlock(req.query.hash, (err, block) => {
    if (err) next(err)
    if (typeof block.Transactions !== 'object') {
      block = JSON.parse(block)
    }
    res.render('tokenblockdetails', {
      page: 'tokenblockdetails',
      title: 'SEC Blockchain - Token Block Details',
      block: block
    })
  })
})

router.get('/tokenblockdetailsbynumber', function (req, res, next) {
  SECCore.APIs.getTokenBlockchain(parseInt(req.query.number), parseInt(req.query.number), (err, block) => {
    block = block[0]
    if (err) next(err)
    if (typeof block.Transactions !== 'object') {
      block = JSON.parse(block)
    }
    res.render('tokenblockdetails', {
      page: 'tokenblockdetails',
      title: 'SEC Blockchain - Token Block Details',
      block: block
    })
  })
})

router.get('/tokentxlist', function (req, res, next) {
  let pageNumber = parseInt(req.query.pageNumber || 1)
  let pageSize = parseInt(req.query.pageSize || 50)
  SECCore.APIs.getWholeTokenBlockchain((err, data) => {
    if (err) next(err)
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
    res.render('tokentxlist', {
      page: 'tokentxlist',
      title: 'SEC Blockchain - Token Tx List',
      pageNumber: pageNumber,
      totalNumber: totalNumber,
      transactions: _transactions
    })
  })
})

router.get('/tokentxlist-pagination', function (req, res, next) {
  let pageNumber = parseInt(req.query.pageNumber || 1)
  let pageSize = parseInt(req.query.pageSize || 50)
  SECCore.APIs.getWholeTokenBlockchain((err, data) => {
    if (err) next(err)
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
})

router.get('/tokentxdetails', function (req, res, next) {
  SECCore.APIs.getTokenTx(req.query.hash, (transaction) => {
    res.render('tokentxdetails', {
      page: 'tokentxdetails',
      title: 'SEC Blockchain - Token Tx Details',
      transaction: transaction
    })
  })
})

router.get('/transactionblockchain', function (req, res, next) {
  res.render('transactionblockchain', { page: 'transactionblockchain', title: 'SEC Blockchain - Transaction Blockchain' })
})

router.get('/transactionblockdetails', function (req, res, next) {
  res.render('transactionblockdetails', { page: 'transactionblockdetails', title: 'SEC Blockchain - Transaction Block Details' })
})

router.get('/contract', function (req, res, next) {
  res.render('contract', { page: 'contract', title: 'SEC Blockchain Smart Contract' })
})

router.get('/contractdetails', function (req, res, next) {
  res.render('contractdetails', { page: 'contractdetails', title: 'SEC Blockchain Smart Contract Details' })
})

router.get('/nodeinfo', function (req, res, next) {
  let nodes = SECCore.CenterController.ndp.getPeers()
  let locations = []
  let flag = 0
  nodes.forEach(node => {
    iplocation(node.address, [], (err, result) => {
      if (err) next(err)
      locations.push(result)
      flag++
      if (flag === nodes.length) {
        console.log(locations)
        res.render('nodeinfo', {
          page: 'nodeinfo',
          title: 'SEC Blockchain Node Informations',
          nodes: nodes,
          locations: locations
        })
      }
    })
  })
})

router.get('/secwallet', function (req, res, next) {
  res.render('secwallet', { page: 'secwallet', title: 'SEC Blockchain Wallet APP' })
})

router.get('/account', function (req, res, next) {
  res.render('account', { page: 'account', title: 'SEC Blockchain Account' })
})

router.get('/accountdetails', function (req, res, next) {
  let address = req.query.address || ''
  SECCore.APIs.getTokenTxForUser(address, (err, txArray) => {
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
    SECCore.APIs.calAccBalance(address, (err, balance) => {
      if (err) next(err)
      res.render('accountdetails', {
        page: 'accountdetails',
        title: 'SEC Blockchain Account Details',
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
  let keyword = req.query.search
  keyword = keyword.substring(0, 2) === '0x' ? keyword.substring(2) : keyword
  if (isNaN(keyword)) {
    if (keyword.length === 64) {
      SECCore.APIs.getTokenBlock(keyword, (err, block) => {
        if (!err) {
          if (typeof block.Transactions !== 'object') {
            block = JSON.parse(block)
          }
          res.render('tokenblockdetails', {
            page: 'tokenblockdetails',
            title: 'SEC Blockchain - Token Block Details',
            block: block
          })
        } else {
          SECCore.APIs.getTokenTx(keyword, transaction => {
            if (transaction) {
              res.render('tokentxdetails', {
                page: 'tokentxdetails',
                title: 'SEC Blockchain - Token Tx Details',
                transaction: transaction
              })
            } else {
              return next(new Error('Wrong Input Block Hash or Tx Hash'))
            }
          })
        }
      })
    } else if (keyword.length === 40) {
      SECCore.APIs.getTokenTxForUser(keyword, (err, txArray) => {
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
        SECCore.APIs.calAccBalance(keyword, (err, balance) => {
          if (err) next(err)
          res.render('accountdetails', {
            page: 'accountdetails',
            title: 'SEC Blockchain Account Details',
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
    SECCore.APIs.getWholeTokenBlockchain((err, data) => {
      if (err) next(err)
      if (parseInt(keyword) < data.length) {
        let block = data[parseInt(keyword)]
        if (typeof block.Transactions !== 'object') {
          block = JSON.parse(block)
        }
        res.render('tokenblockdetails', {
          page: 'tokenblockdetails',
          title: 'SEC Blockchain - Token Block Details',
          block: block
        })
      } else {
        return next(new Error('Block Height too Big'))
      }
    })
  }
})

// -------------------------  OLD VERSION BROWSER  ------------------------
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'SEC Blockchain Explorer Test V 0.1' })
// })

// router.get('/transactionchain', function (req, res, next) {
//   res.render('transactionblockchain', { title: 'SEC Blockchain Explorer Test V 0.1' })
// })

// router.get('/nodeinfo', function (req, res, next) {
//   res.render('nodeinfo', { title: 'SEC Blockchain Node Informations' })
// })

// router.get('/tokenpool', function (req, res, next) {
//   res.render('tokenpool', { title: 'SEC Blockchain Token Pool' })
// })

// router.get('/transactionpool', function (req, res, next) {
//   res.render('transactionpool', { title: 'SEC Blockchain Transaction Pool' })
// })

// router.get('/tokenblock', function (req, res, next) {
//   SECCore.APIs.getTokenBlock(req.query.hash, (err, block) => {
//     if (err) next(err)
//     res.render('tokenblockdetails', {
//       title: 'Token Block Details',
//       block: block
//     })
//   })
// })

// router.get('/transactionblock', function (req, res, next) {
//   console.log(req.query.id)
//   SECCore.APIs.getTransactionBlock(req.query.id, req.query.hash, (err, block) => {
//     if (err) next(err)
//     res.render('transactionblockdetails', {
//       title: 'Transaction Block Details',
//       ID: req.query.id,
//       block: block
//     })
//   })
// })

// router.get('/tokentx', function (req, res, next) {
//   SECCore.APIs.getTokenTx(req.query.hash, (transaction) => {
//     res.render('tokentransactiondetails', {
//       title: 'Token Transaction Details',
//       transaction: transaction
//     })
//   })
// })

// router.get('/tokenpooltx', function (req, res, next) {
//   SECCore.APIs.getTokenTxInPool(req.query.hash, (transaction) => {
//     res.render('tokentransactiondetails', {
//       title: 'Token Transaction Details',
//       transaction: transaction
//     })
//   })
// })

// router.get('/transactiontx', function (req, res, next) {
//   SECCore.APIs.getTransactionTx(req.query.id, req.query.hash, (transaction) => {
//     res.render('transactiontxdetails', {
//       title: 'Transaction Tx Details',
//       transaction: transaction
//     })
//   })
// })

// router.get('/transactionpooltx', function (req, res, next) {
//   SECCore.APIs.getTransactionTxInPool(req.query.id, req.query.hash, (transaction) => {
//     res.render('transactiontxdetails', {
//       title: 'Transaction Tx Details',
//       transaction: transaction
//     })
//   })
// })

// router.get('/secwallet', function (req, res, next) {
//   res.render('secwallet', { title: 'SEC Wallet' })
// })

module.exports = router
