const home = require('./home')
const tokenblockchain = require('./tokenblockchain')
const transactionblockchain = require('./transactionblockchain')
const nodeinfo = require('./nodeinfo')
const tokenpool = require('./tokenpool')
const transactionpool = require('./transactionpool')

module.exports = function (param) {
  let io = param.io
  io.on('connection', function (socket) {
    console.log('Welcome to BIUT Block Socket IO Service')
  })
  io.of('/home').on('connection', home)
  io.of('/tokenblockchain').on('connection', tokenblockchain)
  io.of('/nodeinfo').on('connection', nodeinfo)
  io.of('/tokenpool').on('connection', tokenpool)
  io.of('/transactionpool').on('connection', transactionpool)
  io.of('/transactionblockchain').on('connection', transactionblockchain)
}
