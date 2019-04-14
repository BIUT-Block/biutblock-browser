const SECDatahandler = require('@sec-block/secjs-datahandler')

const config = {
  DBPath: '../data'
}
const addr = 'e11dea9d6b54bdd177eddc442b7cf10c996022e7'

let tokenDB = new SECDatahandler.TokenBlockChainDB(config)

tokenDB.findTxForUser(addr, (e, data) => {
  console.log('getAccInfo')
  console.log(e)
  console.log(data)
})
