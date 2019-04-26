const express = require('express')
const router = express.Router()
const SECCore = require('../src/main').Core
const fs = require('fs')
const GEOIPReader = require('@maxmind/geoip2-node').Reader
const dbBuffer = fs.readFileSync(process.cwd() + '/src/GeoIP2-City.mmdb')
const geoIPReader = GEOIPReader.openBuffer(dbBuffer)

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { page: 'home', title: 'SEC Blockchain Explorer V1.1' })
})

router.get('/genesisBlockHash', function (req, res, next) {
  SECCore.secAPIs.getTokenBlockchain(0, 0, (err, blockArray) => {
    if (err) next(err)
    res.send(blockArray[0].Hash)
  })
})

router.get('/tokenblockchain', function (req, res, next) {
  let pageNumber = parseInt(req.query.pageNumber || 1)
  let pageSize = parseInt(req.query.pageSize || 39)
  SECCore.secAPIs.getWholeTokenBlockchain((err, data) => {
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
  let pageSize = parseInt(req.query.pageSize || 39)
  SECCore.secAPIs.getWholeTokenBlockchain((err, data) => {
    if (err) next(err)
    let blockchain = data.reverse().slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
    res.json(blockchain)
  })
})

router.get('/tokenblockdetails', function (req, res, next) {
  SECCore.secAPIs.getTokenBlock(req.query.hash, (err, block) => {
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
  SECCore.secAPIs.getTokenBlockchain(parseInt(req.query.number), parseInt(req.query.number), (err, block) => {
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
  let pageSize = parseInt(req.query.pageSize || 39)
  SECCore.secAPIs.getWholeTokenBlockchain((err, data) => {
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
  let pageSize = parseInt(req.query.pageSize || 39)
  SECCore.secAPIs.getWholeTokenBlockchain((err, data) => {
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
  SECCore.secAPIs.getTokenTx(req.query.hash, (transaction) => {
    res.render('tokentxdetails', {
      page: 'tokentxdetails',
      title: 'SEC Blockchain - Token Tx Details',
      transaction: transaction
    })
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
  let nodes = SECCore.CenterController.nodesIPSync.getNodesTable()
  res.render('nodeinfo', {
    page: 'nodeinfo',
    title: 'SEC Blockchain Node Informations',
    nodes: nodes
  })
})

router.get('/search', function (req, res, next) {
  let keyword = req.query.search
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
            title: 'SEC Blockchain - Token Block Details',
            block: block
          })
        } else {
          SECCore.secAPIs.getTokenTx(keyword, transaction => {
            if (transaction) {
              res.render('tokentxdetails', {
                page: 'tokentxdetails',
                title: 'SEC Blockchain - Token Tx Details',
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
    SECCore.secAPIs.getWholeTokenBlockchain((err, data) => {
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
        res.redirect('/sen/search?search=' + keyword)
      }
    })
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

router.get('/secwallet', function (req, res, next) {
  res.render('secwallet', { page: 'secwallet', title: 'SEC Blockchain Wallet APP' })
})

router.get('/secwallet-mobile', function (req, res, next) {
  res.render('secwallet-mobile', { page: 'secwallet-mobile', title: 'SEC Blockchain Wallet APP', layout: null })
})

router.get('/account', function (req, res, next) {
  res.render('account', { page: 'account', title: 'SEC Blockchain Account' })
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
      title: 'SEC Blockchain - Publish Version',
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
// ----------------------------  FOR DEBUGING  ----------------------------
router.get('/pool', function (req, res, next) {
  res.json({
    secpool: SECCore.CenterController.secChain.pool.getAllTxFromPool().reverse(),
    senpool: SECCore.CenterController.senChain.pool.getAllTxFromPool().reverse()
  })
})

router.get('/alltx', function (req, res, next) {
  SECCore.secAPIs.getWholeTokenBlockchain((err, data) => {
    if (err) next(err)
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
})

router.get('/alltxwithpool', function (req, res, next) {
  SECCore.secAPIs.getWholeTokenBlockchain((err, data) => {
    if (err) next(err)
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
        secpool: SECCore.CenterController.secChain.pool.getAllTxFromPool().reverse(),
        sectx: sectransactions,
        senpool: SECCore.CenterController.senChain.pool.getAllTxFromPool().reverse(),
        sentx: sentransactions
      })
    })
  })
})

router.get('/blockchain', function (req, res, next) {
  SECCore.secAPIs.getWholeTokenBlockchain((err, secdata) => {
    if (err) next(err)
    SECCore.senAPIs.getWholeTokenBlockchain((err, sendata) => {
      if (err) next(err)
      res.json({
        secblockchain: secdata,
        senblockchain: sendata
      })
    })
  })
})

router.get('/accountaddress', function (req, res, next) {
  res.send(SECCore.SECAccount.getAddress())
})

router.get('/tokenblockhashlist', function (req, res, next) {
  SECCore.secAPIs.getWholeTokenBlockchain((err, data) => {
    if (err) return next(err)
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
})

router.get('/ndptable', function (req, res, next) {
  let peers = SECCore.CenterController.ndp.getPeers()
  res.json(peers.map(peer => { return { id: peer.id.toString('hex'), address: peer.address } }))
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
        title: 'SEC Blockchain - Logs',
        logs: logs,
        errors: errors
      })
    })
  })
})

module.exports = router
