const express = require('express')
const router = express.Router()
const SECCore = require('../src/main').Core
const fs = require('fs')
const GEOIPReader = require('@maxmind/geoip2-node').Reader
const dbBuffer = fs.readFileSync(process.cwd() + '/src/GeoIP2-City.mmdb')
const geoIPReader = GEOIPReader.openBuffer(dbBuffer)
const generatePassword = require('password-generator')
const SECUtil = require('@biut-block/biutjs-util')
const request = require('request')

const chargerAddress = 'c4be3c8093fd7acdcdf415331040fc974f8b2ad5'
const chargerPrivateKey = 'f847ed41c167b3d89fd79b634a8049dd3a49ada638c494e170e02daf119b0187'

function _createTransaction (sendToAddress, amount, txFee) {
  let timeStamp = new Date().getTime()
  let transferData = [{
    timestamp: timeStamp,
    from: chargerAddress,
    to: sendToAddress,
    value: amount,
    txFee: txFee,
    gasLimit: '0',
    gas: '0',
    gasPrice: '0',
    data: '',
    inputData: ''
  }]
  const tokenTxBuffer = [
    SECUtil.bufferToInt(transferData[0].timestamp),
    Buffer.from(transferData[0].from, 'hex'),
    Buffer.from(transferData[0].to, 'hex'),
    Buffer.from(transferData[0].value),
    Buffer.from(transferData[0].gasLimit),
    Buffer.from(transferData[0].gas),
    Buffer.from(transferData[0].gasPrice),
    Buffer.from(transferData[0].inputData)
  ]
  let txSigHash = Buffer.from(SECUtil.rlphash(tokenTxBuffer).toString('hex'), 'hex')
  let signature = SECUtil.ecsign(txSigHash, Buffer.from(chargerPrivateKey, 'hex'))
  transferData[0].data = {
    v: signature.v,
    r: signature.r.toString('hex'),
    s: signature.s.toString('hex')
  }
  return transferData
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    page: 'home',
    title: 'BIUT Blockchain Explorer V1.1'
  })
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
      title: 'BIUT Blockchain - Token Blockchain',
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
      title: 'BIUT Blockchain - Token Block Details',
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
      title: 'BIUT Blockchain - Token Block Details',
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
      title: 'BIUT Blockchain - Token Tx List',
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
      title: 'BIUT Blockchain - Token Tx Details',
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
    SECCore.secAPIs.getWholeTokenBlockchain((err, data) => {
      if (err) next(err)
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
  res.send(SECCore.Account.getAddress())
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

router.get('/tokenblockhashlist-sen', function (req, res, next) {
  SECCore.senAPIs.getWholeTokenBlockchain((err, data) => {
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
router.get('/mapping', (req, res, next) => {
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
      mappings = []
    }
    mapping._id = generatePassword()
    mapping.timestamp = new Date()
    mapping.ethaddress = SECUtil.privateToAddress(SECUtil.privateToBuffer(mapping.ethprivatekey)).toString('hex')
    mapping.confirm = 'false'
    mappings.push(mapping)
    fs.writeFile(process.cwd() + '/public/mapping.json', JSON.stringify(mappings), (err) => {
      if (err) next(err)
      res.send('You have already submitted your transfer information successfully.')
    })
  })
})

router.get('/mapping/edit', (req, res, next) => {
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
        res.render('mapping', {
          page: 'mapping',
          title: 'BIUT Blockchain - Mapping Controller',
          mapping: mapping
        })
      }
    })
  })
})

router.post('/mapping/edit', (req, res, next) => {
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
      if (mapping._id === _mapping.id) {
        _mapping.ethprivatekey = mapping.ethprivatekey
        _mapping.ethaddress = mapping.ethaddress
        _mapping.biutaddress = mapping.biutaddress
        _mapping.value = mapping.value
        fs.writeFile(process.cwd() + '/public/mapping.json', JSON.stringify(mappings), (err) => {
          if (err) next(err)
          return res.redirect('/mapping-controller')
        })
      }
    })
  })
})

router.get('/mapping/verify', (req, res, next) => {
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

router.post('/mapping/verify', (req, res, next) => {
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
        _mapping.ethprivatekey = mapping.ethprivatekey
        _mapping.ethaddress = mapping.ethaddress
        _mapping.biutaddress = mapping.biutaddress
        _mapping.confirm = mapping.confirm
        _mapping.value = mapping.value
        _mapping.remarks = mapping.remarks
        if (req.query.type !== 'save') {
          console.log('transfer')
          let bodyRequest = _createTransaction(_mapping.biutaddress, _mapping.value, '0')
          request({
            method: 'POST',
            url: 'http://localhost:3002',
            body: JSON.stringify(bodyRequest),
            headers: {
              'Content-Type': 'application/json'
            }
          }, (err, response, body) => {
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

router.get('/mapping/remove', (req, res, next) => {
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

router.get('/mapping-controller', (req, res, next) => {
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
