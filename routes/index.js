const express = require('express')
const router = express.Router()
const SECCore = require('../src/main').secCore

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'SEC Blockchain Explorer Test V 0.1' })
})

router.get('/transactionchain', function (req, res, next) {
  res.render('transactionblockchain', { title: 'SEC Blockchain Explorer Test V 0.1' })
})

router.get('/nodeinfo', function (req, res, next) {
  res.render('nodeinfo', { title: 'SEC Blockchain Node Informations' })
})

router.get('/tokenpool', function (req, res, next) {
  res.render('tokenpool', { title: 'SEC Blockchain Token Pool' })
})

router.get('/transactionpool', function (req, res, next) {
  res.render('transactionpool', { title: 'SEC Blockchain Transaction Pool' })
})

router.get('/tokenblock', function (req, res, next) {
  SECCore.APIs.getTokenBlock(req.query.hash, (err, block) => {
    if (err) next(err)
    res.render('tokenblockdetails', {
      title: 'Token Block Details',
      block: block
    })
  })
})

router.get('/transactionblock', function (req, res, next) {
  console.log(req.query.id)
  SECCore.APIs.getTransactionBlock(req.query.id, req.query.hash, (err, block) => {
    if (err) next(err)
    res.render('transactionblockdetails', {
      title: 'Transaction Block Details',
      ID: req.query.id,
      block: block
    })
  })
})

router.get('/tokentx', function (req, res, next) {
  SECCore.APIs.getTokenTx(req.query.hash, (transaction) => {
    res.render('tokentransactiondetails', {
      title: 'Token Transaction Details',
      transaction: transaction
    })
  })
})

router.get('/tokenpooltx', function (req, res, next) {
  SECCore.APIs.getTokenTxInPool(req.query.hash, (transaction) => {
    res.render('tokentransactiondetails', {
      title: 'Token Transaction Details',
      transaction: transaction
    })
  })
})

router.get('/transactiontx', function (req, res, next) {
  SECCore.APIs.getTransactionTx(req.query.id, req.query.hash, (transaction) => {
    res.render('transactiontxdetails', {
      title: 'Transaction Tx Details',
      transaction: transaction
    })
  })
})

router.get('/transactionpooltx', function (req, res, next) {
  SECCore.APIs.getTransactionTxInPool(req.query.id, req.query.hash, (transaction) => {
    res.render('transactiontxdetails', {
      title: 'Transaction Tx Details',
      transaction: transaction
    })
  })
})

router.get('/secwallet', function (req, res, next) {
  res.render('secwallet', { title: 'SEC Wallet' })
})

module.exports = router
