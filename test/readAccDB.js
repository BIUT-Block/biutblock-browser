const SECDatahandler = require('@sec-block/secjs-datahandler')

const config = {
  DBPath: '../data/test/tokenBlockChain'
}

let accTree = new SECDatahandler.AccTreeDB(config)

accTree.getAllDB((e, data) => {
  console.log(data)
})
