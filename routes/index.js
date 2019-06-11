const express = require('express')
const router = express.Router()
const SECCore = require('../src/main').Core
const BlockchainCache = require('../src/blockchainCache')
const fs = require('fs')
const GEOIPReader = require('@maxmind/geoip2-node').Reader
const dbBuffer = fs.readFileSync(process.cwd() + '/src/GeoIP2-City.mmdb')
const geoIPReader = GEOIPReader.openBuffer(dbBuffer)
const generatePassword = require('password-generator')
const request = require('request')
const _ = require('lodash')
const Utils = require('../src/utils')
const auth = require('../models/auth')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    page: 'home',
    title: 'BIUT Blockchain Explorer V1.1'
  })
})

router.get('/BIUTChainInfo', function (req, res, next) {
  let BIUTChain = BlockchainCache.getBIUTChain()
  let BIUTTxs = BlockchainCache.getBIUTTxs()
  let TransactionsSum = BIUTTxs.length
  res.json({
    BlockSum: BIUTChain.length,
    blockchain: _.takeRight(BIUTChain, 20).reverse(),
    TransactionsSum: TransactionsSum
  })
})

router.get('/BIUChainInfo', function (req, res, next) {
  let BIUChain = BlockchainCache.getBIUChain()
  let BIUTxs = BlockchainCache.getBIUTxs()
  let TransactionsSum = BIUTxs.length
  res.json({
    BlockSum: BIUChain.length,
    blockchain: _.takeRight(BIUChain, 20).reverse(),
    TransactionsSum: TransactionsSum,
    accountNumber: TransactionsSum / 2 * 3
  })
})

router.get('/genesisBlockHash', function (req, res, next) {
  res.send(BlockchainCache.getBIUTChain()[0].Hash)
})

router.get('/tokenblockchain', function (req, res, next) {
  let pageNumber = parseInt(req.query.pageNumber || 1)
  let pageSize = parseInt(req.query.pageSize || 39)
  let data = BlockchainCache.getBIUTChain()
  let totalNumber = data.length
  let blockchain = data.reverse().slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
  res.render('tokenblockchain', {
    page: 'tokenblockchain',
    title: 'BIUT Blockchain - Token Blockchain',
    pageNumber: pageNumber,
    totalNumber: totalNumber,
    blockchain: blockchain
  })
})

router.get('/tokenblockchain-pagination', function (req, res, next) {
  let pageNumber = parseInt(req.query.pageNumber || 1)
  let pageSize = parseInt(req.query.pageSize || 39)
  let data = BlockchainCache.getBIUTChain()
  let blockchain = data.reverse().slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
  res.json(blockchain)
})

router.get('/tokenblockdetails', function (req, res, next) {
  let data = BlockchainCache.getBIUTChain()
  data.forEach(_block => {
    if (_block.Hash === req.query.hash) {
      res.render('tokenblockdetails', {
        page: 'tokenblockdetails',
        title: 'BIUT Blockchain - Token Block Details',
        block: _block
      })
    }
  })
})

router.get('/tokenblockdetailsbynumber', function (req, res, next) {
  let block = BlockchainCache.getBIUTChain()[parseInt(req.query.number)]
  if (typeof block.Transactions !== 'object') {
    block = JSON.parse(block)
  }
  res.render('tokenblockdetails', {
    page: 'tokenblockdetails',
    title: 'BIUT Blockchain - Token Block Details',
    block: block
  })
})

router.get('/tokentxlist', function (req, res, next) {
  let pageNumber = parseInt(req.query.pageNumber || 1)
  let pageSize = parseInt(req.query.pageSize || 39)
  let data = BlockchainCache.getBIUTChain()
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
    title: 'BIUT Blockchain - Token Tx List',
    pageNumber: pageNumber,
    totalNumber: totalNumber,
    transactions: _transactions
  })
})

router.get('/tokentxlist-pagination', function (req, res, next) {
  let pageNumber = parseInt(req.query.pageNumber || 1)
  let pageSize = parseInt(req.query.pageSize || 39)
  let data = BlockchainCache.getBIUTChain()
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
  let BIUTTxs = BlockchainCache.getBIUTTxs()
  BIUTTxs.forEach(tx => {
    if (req.query.hash === tx.TxHash) {
      res.render('tokentxdetails', {
        page: 'tokentxdetails',
        title: 'BIUT Blockchain - Token Tx Details',
        transaction: tx
      })
    }
  })
})

router.get('/accountdetails', function (req, res, next) {
  let address = req.query.address || ''
  SECCore.secAPIs.getTokenTxForUser(address, (err, txArray) => {
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
    SECCore.secAPIs.getBalance(address, (err, balance) => {
      if (err) next(err)
      res.render('accountdetails', {
        page: 'accountdetails',
        title: 'BIUT Blockchain Account Details',
        address: address,
        txArray: txArray,
        balance: balance,
        income: income,
        spend: spend
      })
    })
  })
})

router.get('/transactionblockchain', function (req, res, next) {
  res.render('transactionblockchain', {
    page: 'transactionblockchain',
    title: 'BIUT Blockchain - Transaction Blockchain'
  })
})

router.get('/transactionblockdetails', function (req, res, next) {
  res.render('transactionblockdetails', {
    page: 'transactionblockdetails',
    title: 'BIUT Blockchain - Transaction Block Details'
  })
})

router.get('/contract', function (req, res, next) {
  res.render('contract', {
    page: 'contract',
    title: 'BIUT Blockchain Smart Contract'
  })
})

router.get('/contractdetails', function (req, res, next) {
  res.render('contractdetails', {
    page: 'contractdetails',
    title: 'BIUT Blockchain Smart Contract Details'
  })
})

router.get('/nodeinfo', function (req, res, next) {
  let nodes = SECCore.CenterController.nodesIPSync.getNodesTable()
  res.render('nodeinfo', {
    page: 'nodeinfo',
    title: 'BIUT Blockchain Node Informations',
    nodes: nodes
  })
})

router.get('/search', function (req, res, next) {
  let keyword = req.query.search.replace(/\s/g, '')
  keyword = keyword.substring(0, 2) === '0x' ? keyword.substring(2) : keyword
  if (isNaN(keyword)) {
    if (keyword.length === 64) {
      SECCore.secAPIs.getTokenBlock(keyword, (err, block) => {
        if (!err) {
          if (typeof block.Transactions !== 'object') {
            block = JSON.parse(block)
          }
          res.render('tokenblockdetails', {
            page: 'tokenblockdetails',
            title: 'BIUT Blockchain - Token Block Details',
            block: block
          })
        } else {
          SECCore.secAPIs.getTokenTx(keyword, transaction => {
            if (transaction) {
              res.render('tokentxdetails', {
                page: 'tokentxdetails',
                title: 'BIUT Blockchain - Token Tx Details',
                transaction: transaction
              })
            } else {
              res.redirect('/sen/search?search=' + keyword)
            }
          })
        }
      })
    } else if (keyword.length === 40) {
      SECCore.secAPIs.getTokenTxForUser(keyword, (err, txArray) => {
        if (err) next(err)
        if (txArray.length === 0) {
          res.redirect('/sen/search?search=' + keyword)
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
        SECCore.secAPIs.getBalance(keyword, (err, balance) => {
          if (err) next(err)
          res.render('accountdetails', {
            page: 'accountdetails',
            title: 'BIUT Blockchain Account Details',
            address: keyword,
            txArray: txArray,
            balance: balance + '',
            income: income,
            spend: spend
          })
        })
      })
    } else {
      return next(new Error('Wrong Input parameter'))
    }
  } else {
    let data = BlockchainCache.getBIUTChain()
    if ((parseInt(keyword) < data.length) && (parseInt(keyword) > -1)) {
      let block = data[parseInt(keyword)]
      if (typeof block.Transactions !== 'object') {
        block = JSON.parse(block)
      }
      res.render('tokenblockdetails', {
        page: 'tokenblockdetails',
        title: 'BIUT Blockchain - Token Block Details',
        block: block
      })
    } else {
      res.redirect('/sen/search?search=' + keyword)
    }
  }
})

router.get('/nodeinfoapi', function (req, res, next) {
  let nodes = SECCore.CenterController.nodesIPSync.getNodesTable()
  let locations = []
  nodes.forEach(node => {
    locations.push({
      location: geoIPReader.city(node.address),
      node: node
    })
  })
  res.json(locations)
})

router.get('/systeminfoapi', function (req, res, next) {
  let nodes = SECCore.CenterController.nodesIPSync.getNodesTable()
  let tps = _.random(20, 30)
  res.json({
    NodesSum: nodes.length,
    TPS: tps
  })
})

router.get('/tpsapi', function (req, res, next) {
  let nodes = SECCore.CenterController.nodesIPSync.getNodesTable()
  res.send(nodes.length)
})

router.get('/secwallet', function (req, res, next) {
  res.render('secwallet', {
    page: 'secwallet',
    title: 'BIUT Blockchain Wallet APP'
  })
})

router.get('/secwallet-mobile', function (req, res, next) {
  res.render('secwallet-mobile', {
    page: 'secwallet-mobile',
    title: 'BIUT Blockchain Wallet APP',
    layout: null
  })
})

router.get('/account', function (req, res, next) {
  res.render('account', {
    page: 'account',
    title: 'BIUT Blockchain Account'
  })
})

router.get('/publishversion', function (req, res, next) {
  fs.readFile(process.cwd() + '/public/version.json', (err, data) => {
    if (err) next(err)
    let info = {}
    try {
      info = JSON.parse(data)
    } catch (err) {
      console.error(err)
      info = {}
    }
    res.render('publishversion', {
      page: 'publishversion',
      title: 'BIUT Blockchain - Publish Version',
      info: info
    })
  })
})

router.get('/publishversionapi', function (req, res, next) {
  fs.readFile(process.cwd() + '/public/version.json', (err, data) => {
    if (err) next(err)
    let info = {}
    try {
      info = JSON.parse(data)
    } catch (err) {
      console.error(err)
      info = {}
    }
    res.json(info)
  })
})

router.post('/publishversion', function (req, res, next) {
  fs.readFile(process.cwd() + '/public/version.json', (err, data) => {
    if (err) next(err)
    let version = {}
    try {
      version = JSON.parse(data)
    } catch (err) {
      console.error(err)
      version = {}
    }
    version[req.body.platform] = req.body
    fs.writeFile(process.cwd() + '/public/version.json', JSON.stringify(version), (err) => {
      if (err) next(err)
      res.redirect('back')
    })
  })
})

router.post('/iplocation', function (req, res, next) {
  let ips = req.body.ips
  console.log(req.body)
  if (Array.isArray(ips)) {
    let locations = []
    ips.forEach(ip => {
      locations.push({
        location: geoIPReader.city(ip),
        ip: ip
      })
    })
    res.json(locations)
  } else if (typeof ips === 'string') {
    res.json({
      location: geoIPReader.city(ips),
      ip: ips
    })
  } else {
    res.send('invalid input type')
  }
})

// ----------------------------  FOR DEBUGING  ----------------------------
router.get('/pool', function (req, res, next) {
  res.json({
    secpool: SECCore.CenterController.secChain.pool.getAllTxFromPool().sort(),
    senpool: SECCore.CenterController.senChain.pool.getAllTxFromPool().sort()
  })
})

router.get('/alltx', function (req, res, next) {
  let data = BlockchainCache.getBIUTChain()
  let sectransactions = []
  data.reverse().forEach(block => {
    let _transactions = block.Transactions.map(el => {
      let _transaction = Object.assign({}, el)
      _transaction.BlockNumber = block.Number
      _transaction.BlockTimeStamp = block.TimeStamp
      return _transaction
    })
    sectransactions = sectransactions.concat(_transactions)
  })
  SECCore.senAPIs.getWholeTokenBlockchain((err, data) => {
    if (err) next(err)
    let sentransactions = []
    data.reverse().forEach(block => {
      let _transactions = block.Transactions.map(el => {
        let _transaction = Object.assign({}, el)
        _transaction.BlockNumber = block.Number
        _transaction.BlockTimeStamp = block.TimeStamp
        return _transaction
      })
      sentransactions = sentransactions.concat(_transactions)
    })
    res.json({
      sectx: sectransactions,
      sentx: sentransactions
    })
  })
})

router.get('/alltxwithpool', function (req, res, next) {
  let data = BlockchainCache.getBIUTChain()
  let sectransactions = []
  data.reverse().forEach(block => {
    let _transactions = block.Transactions.map(el => {
      let _transaction = Object.assign({}, el)
      _transaction.BlockNumber = block.Number
      _transaction.BlockTimeStamp = block.TimeStamp
      return _transaction
    })
    sectransactions = sectransactions.concat(_transactions)
  })
  data = BlockchainCache.getBIUChain()
  let sentransactions = []
  data.reverse().forEach(block => {
    let _transactions = block.Transactions.map(el => {
      let _transaction = Object.assign({}, el)
      _transaction.BlockNumber = block.Number
      _transaction.BlockTimeStamp = block.TimeStamp
      return _transaction
    })
    sentransactions = sentransactions.concat(_transactions)
  })
  res.json({
    secpool: SECCore.CenterController.secChain.pool.getAllTxFromPool().reverse(),
    sectx: sectransactions,
    senpool: SECCore.CenterController.senChain.pool.getAllTxFromPool().reverse(),
    sentx: sentransactions
  })
})

router.get('/blockchain', function (req, res, next) {
  let secdata = BlockchainCache.getBIUTChain()
  let sendata = BlockchainCache.getBIUChain()
  res.json({
    secblockchain: secdata,
    senblockchain: sendata
  })
})

router.get('/accountaddress', function (req, res, next) {
  res.send(SECCore.Account.getAddress())
})

router.get('/tokenblockhashlist', function (req, res, next) {
  let data = BlockchainCache.getBIUTChain()
  let HashList = []
  data.forEach(block => {
    HashList.push({
      ParentHash: block.ParentHash,
      Hash: block.Hash,
      Number: block.Number
    })
  })
  res.json(HashList)
})

router.get('/tokenblockhashlist-sen', function (req, res, next) {
  let data = BlockchainCache.getBIUChain()
  let HashList = []
  data.forEach(block => {
    HashList.push({
      ParentHash: block.ParentHash,
      Hash: block.Hash,
      Number: block.Number
    })
  })
  res.json(HashList)
})

router.get('/ndptable', function (req, res, next) {
  let peers = SECCore.CenterController.ndp.getPeers()
  res.json(peers.map(peer => {
    return {
      id: peer.id.toString('hex'),
      address: peer.address
    }
  }))
})

router.get('/rlptable', function (req, res, next) {
  let peers = SECCore.CenterController.rlp.getPeers()
  res.json(peers.map(peer => {
    return {
      Address: peer._socket._peername.address,
      id: peer._id.toString('hex'),
      remote_id: peer._remoteId.toString('hex'),
      EIP8: peer._EIP8,
      eventsCount: peer._eventsCount,
      Connected: peer._connected,
      Closed: peer._closed,
      DisconnectReason: peer._disconnectReason,
      DisconnectWe: peer._disconnectWe,
      PingTimeout: peer._pingTimeout,
      Capabilities: {
        name: peer._capabilities[0].name,
        version: peer._capabilities[0].version,
        length: peer._capabilities[0].length
      },
      Socket: {
        Connection: peer._socket.connecting,
        Destroyed: peer._socket._destroyed,
        EventsCount: peer._socket._eventsCount
      },
      Protocol: {
        offset: peer._protocols[0].offset,
        length: peer._protocols[0].length
      }
    }
  }))
})

router.get('/logs', function (req, res, next) {
  let fs = require('fs')
  fs.readFile('/home/sec/.pm2/logs/www-out.log', function (err, logs) {
    if (err) return next(err)
    fs.readFile('/home/sec/.pm2/logs/www-error.log', function (err, errors) {
      if (err) return next(err)
      res.render('logs', {
        page: 'logs',
        title: 'BIUT Blockchain - Logs',
        logs: logs,
        errors: errors
      })
    })
  })
})

// ----------------------------  FOR Mapping  ----------------------------
router.get('/mapping', auth, (req, res, next) => {
  res.render('mapping', {
    page: 'mapping',
    title: 'BIUT Blockchain - Mapping Controller',
    mapping: {}
  })
})

router.post('/mapping', (req, res, next) => {
  let mapping = req.body
  fs.readFile(process.cwd() + '/public/mapping.json', (err, data) => {
    if (err) next(err)
    let mappings = []
    try {
      mappings = JSON.parse(data) || []
    } catch (err) {
      console.error(err)
      res.status(500)
      res.statusMessage = 'request error'
      return res.json({ status: 'failed', info: 'request error' })
    }
    request.get(`http://api.etherscan.io/api?module=account&action=tokentx&address=0x${(mapping.ethaddress.substring(0, 2) === '0x' ? mapping.ethaddress.substring(2) : mapping.ethaddress).toLowerCase()}&startblock=0&endblock=999999999&sort=asc&apikey=FKI6JY1EK4ENZMI47SARE4XK9CQ7PD7C3H`, function (error, response, body) {
      if (error) {
        res.status(500)
        res.statusMessage = 'request error'
        return res.json({ status: 'failed', info: 'request error' })
      }
      let flag = false
      let data = JSON.parse(response.body)
      data.result.forEach(tx => {
        if (tx.hash === `0x${(mapping.txhash.substring(0, 2) === '0x' ? mapping.txhash.substring(2) : mapping.txhash).toLowerCase()}` && tx.contractAddress === '0xc6689eb9a6d724b8d7b1d923ffd65b7005da1b62' && tx.to === '0xc7c1ca6181c222f5d83ec6814c28db7da73409bb') {
          flag = true
          mapping.value = tx.value / 1000000000000000000
        }
      })
      if (!flag) {
        res.status(500)
        res.statusMessage = 'txhash not found in eth network'
        return res.json({ status: 'failed', info: 'txhash not found in eth network or not in sec contract' })
      }
      flag = true
      mappings.forEach(_mapping => {
        if (_mapping.txhash === mapping.txhash) {
          flag = false
        }
      })
      if (!flag) {
        res.status(500)
        res.statusMessage = 'txhash duplicated'
        return res.json({ status: 'failed', info: 'txhash duplicated' })
      }
      mapping._id = generatePassword()
      mapping.timestamp = new Date()
      mapping.biutaddress = mapping.ethaddress
      mapping.confirm = 'false'
      mappings.push(mapping)
      fs.writeFile(process.cwd() + '/public/mapping.json', JSON.stringify(mappings), (err) => {
        if (err) next(err)
        res.json({ status: 'success' })
      })
    })
  })
})

router.get('/mapping/verify', auth, (req, res, next) => {
  fs.readFile(process.cwd() + '/public/mapping.json', (err, data) => {
    if (err) next(err)
    let mappings = []
    try {
      mappings = JSON.parse(data) || []
    } catch (err) {
      console.error(err)
      mappings = []
    }
    mappings.forEach((mapping, index) => {
      if (mapping._id === req.query.id) {
        res.render('verify', {
          page: 'verify',
          title: 'BIUT Blockchain - Mapping Controller',
          mapping: mapping
        })
      }
    })
  })
})

router.post('/mapping/verify', auth, (req, res, next) => {
  let mapping = req.body
  fs.readFile(process.cwd() + '/public/mapping.json', (err, data) => {
    if (err) next(err)
    let mappings = []
    try {
      mappings = JSON.parse(data) || []
    } catch (err) {
      console.error(err)
      mappings = []
    }
    mappings.forEach((_mapping, index) => {
      if (req.query.id === _mapping._id) {
        _mapping.ethaddress = mapping.ethaddress
        _mapping.txhash = mapping.txhash
        _mapping.biutaddress = mapping.biutaddress
        _mapping.confirm = mapping.confirm
        _mapping.value = mapping.value
        _mapping.remarks = mapping.remarks
        if (req.query.type !== 'save') {
          console.log('transfer')
          let transaction = Utils.createTransaction(_mapping.biutaddress, _mapping.value, '0')
          request({
            method: 'POST',
            url: 'http://localhost:3002',
            body: JSON.stringify({
              'method': 'sec_sendRawTransaction',
              'jsonrpc': '2.0',
              'id': '1',
              'params': transaction
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          }, (err, response, body) => {
            console.log(err)
            console.log(body)
            if (err) {
              res.json(err)
            }
            fs.writeFile(process.cwd() + '/public/mapping.json', JSON.stringify(mappings), (err) => {
              if (err) next(err)
              return res.redirect('/mapping-controller')
            })
          })
        } else {
          fs.writeFile(process.cwd() + '/public/mapping.json', JSON.stringify(mappings), (err) => {
            if (err) next(err)
            return res.redirect('/mapping-controller')
          })
        }
      }
    })
  })
})

router.get('/mapping/remove', auth, (req, res, next) => {
  fs.readFile(process.cwd() + '/public/mapping.json', (err, data) => {
    if (err) next(err)
    let mappings = []
    try {
      mappings = JSON.parse(data) || []
    } catch (err) {
      console.error(err)
      mappings = []
    }
    mappings.forEach((mapping, index) => {
      if (mapping._id === req.query.id) mappings.splice(index, 1)
    })
    fs.writeFile(process.cwd() + '/public/mapping.json', JSON.stringify(mappings), (err) => {
      if (err) next(err)
      res.redirect('/mapping-controller')
    })
  })
})

router.get('/mapping-controller', auth, (req, res, next) => {
  fs.readFile(process.cwd() + '/public/mapping.json', (err, mappings) => {
    if (err) next(err)
    res.render('mapping-controller', {
      page: 'mapping-controller',
      title: 'BIUT Blockchain - Mapping Controller',
      mappings: JSON.parse(mappings) || []
    })
  })
})

module.exports = router
