/* global $ TimeDiff */
let biutTxSum = 0
let biuTxSum = 0
let biutHeight = 0
let biuHeight = 0
let biuAccount = 0
let currenttpsBuffer = []
let transactionsBuffer = []

$(document).ready(() => {
  getBIUTChainInfo()
  getBIUChainInfo()
  getSystemInfo()
  setInterval(() => {
    getBIUTChainInfo()
    getBIUChainInfo()
    getSystemInfo()
  }, 30000)
})

function getBIUTChainInfo () {
  $.getJSON('/BIUTChainInfo', data => {
    biutTxSum = data.TransactionsSum
    biutHeight = data.BlockSum - 1
    let BIUTChain = data.blockchain
    $('#token-block-chain-list').html('')
    $('#token-trans-list').html('')
    let transactions = []
    BIUTChain.forEach((block, index) => {
      let _block = block
      if (typeof block !== 'object') {
        _block = JSON.parse(block)
      }
      transactions = transactions.concat(_block.Transactions)
      if (index < 20) {
        biutBlockList(_block)
      }
    })

    transactions.forEach((_trans, index) => {
      let trans = _trans
      if (typeof _trans !== 'object') {
        trans = JSON.parse(_trans)
      }
      if (index < 50 && trans.TxFrom.substring(0, 4) !== '0000') {
        biutTradingList(trans)
      }
    })
    indexList()

    transactionsBuffer = BIUTChain.slice(0, 20).map(block => {
      if (typeof block !== 'object') {
        block = JSON.parse(block)
      }
      return block.Transactions.length
    })
    transactionssparkline(transactionsBuffer)
  })
}

function getBIUChainInfo () {
  $.getJSON('/BIUChainInfo', data => {
    biuTxSum = data.TransactionsSum
    biuHeight = data.BlockSum - 1
    biuAccount = data.accountNumber
    indexList()
    let TokenBlockchain = data.blockchain
    $('#sen-token-block-chain-list').html('')
    $('#sen-token-trans-list').html('')
    let transactions = []
    TokenBlockchain.forEach((data, index) => {
      let _data = data
      if (typeof data !== 'object') {
        _data = JSON.parse(data)
      }
      transactions = transactions.concat(_data.Transactions)
      if (index < 20) {
        biuBlockList(_data)
      }
    })

    transactions.forEach((_trans, index) => {
      let trans = _trans
      if (typeof _trans !== 'object') {
        trans = JSON.parse(_trans)
      }
      if (index < 50 && trans.TxFrom.substring(0, 4) !== '0000') {
        biuTradingList(trans)
      }
    })
    indexList()
  })
}

function getSystemInfo () {
  $.getJSON('/systeminfoapi', data => {
    $('#onlineNode').html(data.NodesSum)
    $('#current').html(data.TPS)
    if (currenttpsBuffer.length < 11) {
      currenttpsBuffer.push(parseInt(data.TPS))
    } else {
      currenttpsBuffer.shift()
      currenttpsBuffer.push(parseInt(data.TPS))
    }
    tpssparkline(currenttpsBuffer)
  })
}

// 节点列表数据
function indexList () {
  $('#currentHeight').html(`${biutHeight} | ${biuHeight} `)
  $('#accountNumber').html(biuAccount)
  $('#totalTransactions').html(`${biutTxSum} | ${biuTxSum} `)
  $('#peak').html(33118)
}

// 区块列表 table
function biutBlockList (token) {
  let timeDiff = TimeDiff(new Date(token.TimeStamp), new Date())
  $('#token-block-chain-list').append(`
  <ul class="inbox-item">
      <li class="itemList" style="margin-top:13px;padding-bottom: 13px;">
        <div class="inbox-item-text inboxFlex">
          <div class="inboxTit">
            Height: <a href="/tokenblockdetailsbynumber?number=${token.Number}">${token.Number}</a>
            <span class="inboxTit inboxTitMargin" style="margin-left:50px;">
              Transactions: <span class="inboxTxt">${token.Transactions.filter(tx => { return tx.TxFrom.substring(0, 4) !== '0000' && tx.TxTo.substring(0, 4) !== '0000' }).length}</span>
            </span>
          </div>
          <span class="inboxTit">
            Time: ${timeDiff}
          </span>
        </div>
      </li>
    </ul>
  `)
}

// 交易列表 table
function biutTradingList (trans) {
  $('#token-trans-list').append(`
  <ul class="inbox-item">
    <li class="itemList" style="margin-top:13px;padding-bottom: 13px;">
      <div class="inbox-item-text inboxFlex">
        <div class="inboxTit">
          TxHash: <a href="/tokentxdetails?hash=${trans.TxHash}" class="inboxTxtB">0x${trans.TxHash.substring(0, 16)}...</a>
        </div>
        <span>
          <span class="inboxTxt">${trans.TxReceiptStatus}</span>
        </span>
      </div>
      <div class="inbox-item-text m-t-5 inboxFlex">
        <div  class="inboxTit">
          From: <a href="/accountdetails?address=${trans.TxFrom}">0x${trans.TxFrom.substring(0, 16)}...</a>
          <span style="margin-left: 30px;">
            To: <a href="/accountdetails?address=${trans.TxTo}">0x${trans.TxTo.substring(0, 16)}...</a>
          </span>
        </div>
      </div>
      <div class="inbox-item-text m-t-5 inboxTit">
        <span class="inboxTxt"> ${getPointNum(trans.Value, 8)} BIUT</span>
      </div>
    </li>
  </ul>
  `)
}

// 区块列表 table
function biuBlockList (token) {
  let timeDiff = TimeDiff(new Date(token.TimeStamp), new Date())
  $('#sen-token-block-chain-list').append(`
  <ul class="inbox-item">
      <li class="itemList" style="margin-top:13px;padding-bottom: 13px;">
        <div class="inbox-item-text inboxFlex">
          <div class="inboxTit">
            Height: <a href="/sen/tokenblockdetailsbynumber?number=${token.Number}">${token.Number}</a>
            <span class="inboxTit inboxTitMargin" style="margin-left:50px;">
              Transactions: <span class="inboxTxt">${token.Transactions.filter(tx => { return tx.TxFrom.substring(0, 4) !== '0000' && tx.TxTo.substring(0, 4) !== '0000' }).length}</span>
            </span>
          </div>
          <span class="inboxTit">
            Time: ${timeDiff}
          </span>
        </div>
        <div class="inbox-item-text m-t-5">
          Mined by: <a href="/sen/accountdetails?address=${token.Beneficiary}">0x${token.Beneficiary}</a>
        </div>
        <div class="inbox-item-text m-t-5 inboxTit">
          <span class="inboxTxt">
            Block Reward: ${token.Transactions[0] ? getPointNum(token.Transactions[0].Value, 8) : 0} BIU
          </span>
        </div>
      </li>
    </ul>
  `)
}

// 交易列表 table
function biuTradingList (trans) {
  $('#sen-token-trans-list').append(`
  <ul class="inbox-item">
    <li class="itemList" style="margin-top:13px;padding-bottom: 13px;">
      <div class="inbox-item-text inboxFlex">
        <div class="inboxTit">
          TxHash: <a href="/sen/tokentxdetails?hash=${trans.TxHash}" class="inboxTxtB">0x${trans.TxHash.substring(0, 16)}...</a>
        </div>
        <span>
          <span class="inboxTxt">${trans.TxReceiptStatus}</span>
        </span>
      </div>
      <div class="inbox-item-text m-t-5 inboxFlex">
        <div  class="inboxTit">
          From: <a href="/sen/accountdetails?address=${trans.TxFrom}">0x${trans.TxFrom.substring(0, 16)}...</a>
          <span style="margin-left: 30px;">
            To: <a href="/sen/accountdetails?address=${trans.TxTo}">0x${trans.TxTo.substring(0, 16)}...</a>
          </span>
        </div>
      </div>
      <div class="inbox-item-text m-t-5 inboxTit">
        <span class="inboxTxt">${getPointNum(trans.Value, 8)} BIU</span>
      </div>
    </li>
  </ul>
  `)
}

function tpssparkline (currenttpsBuffer) {
  $('#currenttps-sparkline').sparkline(currenttpsBuffer, {
    type: 'line',
    width: '100%',
    height: '300',
    chartRangeMax: 40,
    lineColor: '#00b19d',
    fillColor: 'rgba(0, 177, 157, 0.3)',
    highlightLineColor: 'rgba(0,0,0,.1)',
    highlightSpotColor: 'rgba(0,0,0,.2)'
  })
}

function transactionssparkline (transactionsBuffer) {
  $('#transactions-sparkline').sparkline(transactionsBuffer, {
    type: 'line',
    width: '100%',
    height: '300',
    chartRangeMax: 50,
    lineColor: '#3bafda',
    fillColor: 'rgba(59,175,218,0.3)',
    highlightLineColor: 'rgba(0,0,0,.1)',
    highlightSpotColor: 'rgba(0,0,0,.2)'
  })
}

function getPointNum (num, n) {
  let str = String(num)
  let index = str.indexOf('.')
  let str1 = str.substring(0, index + n + 1)
  str1 = Number(str1)
  return str1
}
